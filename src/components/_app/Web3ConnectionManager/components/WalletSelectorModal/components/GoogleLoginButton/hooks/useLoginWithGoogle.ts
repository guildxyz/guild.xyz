import Bugsnag from "@bugsnag/js"
import { useDisclosure } from "@chakra-ui/react"
import { useConnect as usePlatformConnect } from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { addressLinkParamsAtom } from "components/common/Layout/components/Account/components/AccountModal/components/LinkAddressButton"
import useSetKeyPair from "hooks/useSetKeyPair"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"
import { mutate } from "swr"
import { shouldUseReCAPTCHAAtom } from "utils/recaptcha"
import { useConnect } from "wagmi"
import {
  WAAS_CONNECTOR_ID,
  WaaSConnector,
  WaasActionFailed,
} from "wagmiConfig/waasConnector"
import useLinkAddress from "../../../hooks/useLinkAddress"
import {
  DriveRequestFailed,
  getDriveFileAppProperties,
  listWalletsOnDrive,
  uploadBackupDataToDrive,
} from "../utils/googleDrive"
import useDriveOAuth from "./useDriveOAuth"

const useLoginWithGoogle = () => {
  const addressLinkParams = useAtomValue(addressLinkParamsAtom)
  const { onOpen, onClose, isOpen } = useDisclosure()
  const toast = useToast()
  const { captureEvent: capture } = usePostHogContext()
  const captureEvent = (message: string, options?: Record<string, any>) => {
    let finalOptions = options
    if (options?.error instanceof Error) {
      finalOptions = {
        ...finalOptions,
        errorMessage: options.error.message,
        errorName: options.error.name,
        errorStack: options.error.stack,
        errorCause: options.error.cause,
      }

      if (options.error.cause instanceof Error) {
        finalOptions = {
          ...finalOptions,
          causeMessage: options.error.cause.message,
          causeName: options.error.cause.name,
          causeStack: options.error.cause.stack,
          causeCause: options.error.cause.cause,
        }
      }

      Bugsnag.notify(options.error, (event) => {
        event.severity = "error"
        event.context = message
      })
    }

    capture(message, finalOptions)
  }
  const { connectAsync, connectors } = useConnect()
  const cwaasConnector = connectors.find(
    ({ id }) => id === WAAS_CONNECTOR_ID
  ) as WaaSConnector

  const [isNewWallet, setIsNewWallet] = useState(false)

  const googleAuth = useDriveOAuth()

  const { onSubmit: onConnectGoogleSubmit } = usePlatformConnect({
    onSuccess: () => {
      captureEvent("[WaaS] Google platform connected")
    },
    onError: (err) => {
      captureEvent("[WaaS] Google platform connection failed", { error: err })
      throw new StopExecution()
    },
  })

  const { onSubmit: onSetKeypairSubmit } = useSetKeyPair({
    onSuccess: () => captureEvent("[WaaS] Keypair verified"),
    onError: (err) => {
      captureEvent("[WaaS] Failed to verify keypair", { error: err })
      throw err
    },
    allowThrow: true,
  })

  const { onSubmit: onLinkAddress } = useLinkAddress()

  const createOrRestoreWallet = async (accessToken: string) => {
    const { files } = await listWalletsOnDrive(accessToken)

    if (files.length <= 0) {
      setIsNewWallet(true)
    }

    onOpen()

    if (files.length <= 0) {
      const { wallet, account } = await cwaasConnector.createWallet()

      await uploadBackupDataToDrive(wallet.backup, account.address, accessToken)
      return true
    } else {
      const {
        appProperties: { backupData },
      } = await getDriveFileAppProperties(files[0].id, accessToken)

      // TODO: Check if the current wallet (if there is one) is the same. If so, don't call restore
      await cwaasConnector.restoreWallet(backupData)
      return false
    }
  }

  const setShouldUseReCAPTCHA = useSetAtom(shouldUseReCAPTCHAAtom)

  const logInWithGoogle = useSubmit(
    async () => {
      setShouldUseReCAPTCHA(true)

      captureEvent("[WaaS] Log in with Google clicked")

      // 1) Google OAuth
      const { authData, error } = await googleAuth.onOpen()

      if (!authData || !!error) {
        // Ignore cases, when the user cancels the OAuth
        if (error?.error !== "access_denied") {
          captureEvent("[WaaS] Google OAuth failed", { error })
        } else {
          captureEvent("[WaaS] Google OAuth denied", { error })
        }
        return
      }

      captureEvent("[WaaS] Successful Google OAuth")

      // 2) Create or Restore wallet
      const isNew = await createOrRestoreWallet(
        (authData as any)?.access_token
      ).catch((err) => {
        const isMissingScope =
          err instanceof DriveRequestFailed && err.isMissingScope

        if (isMissingScope) {
          captureEvent("[WaaS] Missing Drive permission", {
            error: err,
            cause: err instanceof Error ? err.cause : undefined,
          })
        } else {
          captureEvent("[WaaS] Wallet creation / restoration failed", {
            error: err,
            hasDriveFailed: err instanceof DriveRequestFailed,
            hasWaasFailed: err instanceof WaasActionFailed,
            cause: err instanceof Error ? err.cause : undefined,
          })
        }

        toast({
          status: "error",
          title: "Error",
          description: err instanceof Error ? err.message : "Unknown error",
        })

        throw err
      })

      captureEvent("[WaaS] Wallet successfully initialized", { isNew })

      // 3) Verify a keypair, or link address to main user
      const walletClient: any = await cwaasConnector.getClient()

      const signProps = {
        walletClient,
        address: walletClient.account.address,
      }

      let userId: number

      const keyPair = !!addressLinkParams?.userId
        ? await onLinkAddress({ ...addressLinkParams, signProps }).then(
            (result) => result?.keyPair
          )
        : await onSetKeypairSubmit({
            signProps,
          }).then((result) => {
            if (result?.user) {
              userId = result.user?.id
            }
            return result?.keyPair
          })

      // 4) Try to connect Google account
      const platformUser = await onConnectGoogleSubmit({
        signOptions: {
          keyPair: keyPair.keyPair,
          ...signProps,
        },
        platformName: "GOOGLE",
        authData,
        disconnectFromExistingUser: true,
      })

      if (userId && platformUser) {
        await mutate(
          [`/v2/users/${userId}/profile`, { method: "GET", body: {} }],
          (prev) => ({
            ...prev,
            platformUsers: [...(prev?.platformUsers ?? []), platformUser],
          }),
          { revalidate: false }
        )
      }

      if (!isNew) {
        await connectAsync({ connector: cwaasConnector })
        captureEvent("[WaaS] Wallet is connected")
        onClose()
      }

      return true
    },
    {
      onError: () => {
        onClose()
      },
    }
  )

  return {
    isNewWallet,
    isOpen,
    onClose,
    isGoogleAuthLoading: googleAuth.isAuthenticating,
    ...logInWithGoogle,
  }
}

export class StopExecution extends Error {}

export default useLoginWithGoogle
