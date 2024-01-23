import { useDisclosure } from "@chakra-ui/react"
import { useConnect as usePlatformConnect } from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { publicClient } from "connectors"
import useSetKeyPair from "hooks/useSetKeyPair"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useState } from "react"
import type { CWaaSConnector } from "waasConnector"
import { useConnect } from "wagmi"
import {
  getDriveFileAppProperties,
  listWalletsOnDrive,
  uploadBackupDataToDrive,
} from "../utils/googleDrive"
import useDriveOAuth from "./useDriveOAuth"

const useLoginWithGoogle = () => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const toast = useToast()
  const { captureEvent } = usePostHogContext()
  const { connectors, connectAsync } = useConnect()
  const cwaasConnector = connectors.find(
    ({ id }) => id === "cwaasWallet"
  ) as CWaaSConnector

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

  const logInWithGoogle = useSubmit(
    async () => {
      captureEvent("[WaaS] Log in with Google clicked")

      // 1) Google OAuth
      const { authData, error } = await googleAuth.onOpen()

      if (!authData || !!error) {
        captureEvent("[WaaS] Google OAuth failed", { error })
        return
      }

      captureEvent("[WaaS] Successful Google OAuth")

      // 2) Create or Restore wallet
      const isNew = await createOrRestoreWallet(
        (authData as any)?.access_token
      ).catch((err) => {
        captureEvent("[WaaS] Wallet creation / restoration failed", { error: err })
        toast({
          status: "error",
          title: "Error",
          description: err instanceof Error ? err.message : "Unknown error",
        })
      })

      captureEvent("[WaaS] Wallet successfully initialized", { isNew })

      // 3) Verify a keypair
      const walletClient = await cwaasConnector.getWalletClient()
      const { keyPair, user } = await onSetKeypairSubmit({
        signProps: {
          walletClient,
          address: walletClient.account.address,
        },
      })

      // 4) Try to connect Google account
      await onConnectGoogleSubmit({
        signOptions: {
          keyPair: keyPair.keyPair,
          walletClient,
          address: walletClient.account.address,
          publicClient: publicClient({}),
        },
        platformName: "GOOGLE",
        authData,
      })

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
