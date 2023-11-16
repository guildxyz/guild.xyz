import {
  HStack,
  Img,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import useOauthPopupWindow from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import { useKeyPair } from "components/_app/KeyPairProvider"
import Button from "components/common/Button"
import { EmailPinEntry } from "components/common/Layout/components/Account/components/AccountModal/components/SocialAccount/EmailAddress"
import useVerificationRequest from "components/common/Layout/components/Account/components/AccountModal/components/SocialAccount/hooks/useEmailVerificationRequest"
import useVerifyEmail from "components/common/Layout/components/Account/components/AccountModal/components/SocialAccount/hooks/useVerifyEmail"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import dynamic from "next/dynamic"
import { Check, GoogleLogo } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { uploadBackupDataToDrive } from "utils/googleDrive"
import { getRecaptchaToken } from "utils/recaptcha"
import type { CWaaSConnector } from "waasConnector"
import { useConnect } from "wagmi"

const GuildCastleLoader = dynamic(
  () =>
    import("components/explorer/AnimatedLogo").then(
      ({ GuildCastleLoader: Loader }) => Loader
    ),
  {
    ssr: false,
    loading: () => <Img src="/guildLogos/logo.svg" boxSize={4} />,
  }
)

export default function UserOnboarding({
  createWallet,
  emailAddress,
  onSuccess: paramOnSuccess,
}: {
  createWallet: ReturnType<
    typeof useSubmit<unknown, Awaited<ReturnType<CWaaSConnector["createWallet"]>>>
  >
  emailAddress: string
  onSuccess?: () => void
}) {
  const { connectors, connect } = useConnect()
  const cwaasConnector = connectors.find(
    ({ id }) => id === "cwaasWallet"
  ) as CWaaSConnector

  const toast = useToast()

  const sendCode = useVerificationRequest({}, cwaasConnector)

  useEffect(() => {
    if (!createWallet.response) return

    sendCode.onSubmit({ emailAddress })
  }, [createWallet.response])

  const linkWallet = useVerifyEmail({}, cwaasConnector)

  const [shouldBackupAfterConnect, setShouldBackupAfterConnect] = useState(false)
  const { authData, error, isAuthenticating, onOpen } = useOauthPopupWindow(
    "GOOGLE_DRIVE_FOR_WALLET_BACKUP_ONLY"
  )

  const { ready, set, keyPair, isValid } = useKeyPair()
  const recaptchaRef = useRef<ReCAPTCHA>()

  const uploadToDrive = useSubmit(
    (backupData: string) =>
      uploadBackupDataToDrive(
        backupData,
        createWallet.response.account.address.toLowerCase(),
        (authData as any).access_token
      ),
    {
      onSuccess: async () => {
        toast({
          status: "success",
          title: "Wallet backed up",
          description:
            "Make sure you see a new '.wallet' file in your Google Drive!",
        })

        const recaptchaToken = await getRecaptchaToken(recaptchaRef)

        const walletClient = await cwaasConnector.getWalletClient()

        await set.onSubmit(false, undefined, recaptchaToken, {
          walletClient,
          address: walletClient.account.address,
        })

        connect({ connector: cwaasConnector })
        paramOnSuccess?.()
      },
    }
  )

  useEffect(() => {
    if (
      !!authData &&
      shouldBackupAfterConnect &&
      createWallet.response?.wallet?.backup
    ) {
      uploadToDrive.onSubmit(createWallet.response?.wallet?.backup)
      setShouldBackupAfterConnect(false)
    }
  }, [shouldBackupAfterConnect, authData, createWallet])

  // Loading state while the CWaaS wallet is being created, and while the OTP is being sent (the signature itself also takes a bit of time)
  if (!createWallet.response || !sendCode.response || isAuthenticating) {
    return (
      <>
        <ModalHeader>Setting up Guild account</ModalHeader>
        <ModalBody>
          <Stack alignItems={"center"} spacing={8}>
            <Text fontSize={"lg"}>Your Guild account is being prepared!</Text>
            <GuildCastleLoader style={{ height: 100, width: 100 }} />
            <Text textAlign={"center"}>
              In the meantime, you can connect your Google account, if you wish to
              back your wallet up that way!
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            size={"sm"}
            rightIcon={authData ? <Check /> : <GoogleLogo />}
            colorScheme="blue"
            isLoading={isAuthenticating}
            onClick={() => onOpen()}
            isDisabled={!!authData}
          >
            {authData ? "Google connected" : "Connect Google"}
          </Button>
        </ModalFooter>
      </>
    )
  }

  if (!linkWallet.response) {
    return (
      <>
        <ModalHeader>Almost there!</ModalHeader>
        <ModalBody>
          <Stack spacing={8}>
            <Text>Please enter the code we've sent you in email!</Text>
            <HStack justifyContent={"center"}>
              <EmailPinEntry
                isDisabled={linkWallet.isLoading}
                onCodeEntered={(code) =>
                  linkWallet.onSubmit({
                    code,
                    emailAddress,
                  })
                }
              />
            </HStack>
            <Text textAlign={"center"}>
              {linkWallet.isLoading ? (
                <HStack alignItems={"center"} justifyContent={"center"}>
                  <Text colorScheme="gray">Checking verification code</Text>
                  <Spinner color="gray" size={"sm"} />
                </HStack>
              ) : (
                <>
                  Haven't received the code? No worries, you can{" "}
                  <Button
                    isDisabled={sendCode.isLoading}
                    onClick={() => sendCode.onSubmit({ emailAddress })}
                    variant="link"
                  >
                    request another one
                  </Button>
                </>
              )}
            </Text>
          </Stack>
        </ModalBody>
      </>
    )
  }

  return (
    <>
      <ModalHeader>The most important step!</ModalHeader>
      <ModalBody>
        <Stack>
          <Text>
            It is critically important to back up your wallet. The backup of your
            wallet provides the only way to access it. It can only be backed up now.
            Only the person with access to the backup can use the wallet, which means
            that the Guild team can't help you if this backup is lost or compromised.
            It must be stored in a safe environment
          </Text>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
        />
        <Button
          isLoading={
            uploadToDrive.isLoading ||
            isAuthenticating ||
            set.isLoading ||
            set.isSigning
          }
          size={"sm"}
          rightIcon={<GoogleLogo />}
          colorScheme="blue"
          onClick={() => {
            // if(!createWallet.response?.wallet?.backup) {
            //   toast(wallet can't be backed up. please try again)
            // }
            if (authData) {
              uploadToDrive.onSubmit(createWallet.response?.wallet?.backup)
            } else {
              setShouldBackupAfterConnect(true)
              onOpen()
            }
          }}
        >
          Back up my wallet
        </Button>
      </ModalFooter>
    </>
  )
}
