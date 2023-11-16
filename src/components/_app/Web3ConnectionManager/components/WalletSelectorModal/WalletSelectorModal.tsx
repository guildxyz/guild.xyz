import {
  AbsoluteCenter,
  Box,
  Divider,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import MetaMaskOnboarding from "@metamask/onboarding"
import useOauthPopupWindow from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import { useKeyPair } from "components/_app/KeyPairProvider"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Error as CustomError } from "components/common/Error"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { ArrowLeft, ArrowSquareOut, GoogleLogo } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import {
  getDriveFileAppProperties,
  listWalletsOnDrive,
  uploadBackupDataToDrive,
} from "utils/googleDrive"
import { getRecaptchaToken } from "utils/recaptcha"
import type { CWaaSConnector } from "waasConnector"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { useWeb3ConnectionManager } from "../../Web3ConnectionManager"
import ConnectorButton from "./components/ConnectorButton"
import DelegateCashButton from "./components/DelegateCashButton"
import UserOnboarding from "./components/UserOnboarding"
import useIsWalletConnectModalActive from "./hooks/useIsWalletConnectModalActive"
import useShouldLinkToUser from "./hooks/useShouldLinkToUser"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

// We don't open the modal on these routes
const ignoredRoutes = ["/_error", "/tgauth", "/oauth", "/googleauth"]

const genericErrorToastCallback =
  (toast: ReturnType<typeof useToast>) => (error: any) => {
    toast({
      status: "error",
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error",
    })
  }

const GoogleLoginButton = () => {
  const recaptchaRef = useRef<ReCAPTCHA>()
  const { connectors, connectAsync } = useConnect()
  const cwaasConnector = connectors.find(
    ({ id }) => id === "cwaasWallet"
  ) as CWaaSConnector

  // TODO: Retain access code until it expires (or gets revoked), so if something fails, and has to retry, doesn't need to OAuth again
  const googleAuth = useOauthPopupWindow("GOOGLE_DRIVE_FOR_WALLET_BACKUP_ONLY")

  const { set } = useKeyPair()
  const toast = useToast()

  const createOrRestoreWallet = useSubmit(
    async (accessToken: string) => {
      const { files } = await listWalletsOnDrive(accessToken)

      if (files.length <= 0) {
        const { wallet, account } = await cwaasConnector.createWallet()
        await uploadBackupDataToDrive(wallet.backup, account.address, accessToken)
      } /* if (files.length == 1) */ else {
        const {
          appProperties: { backupData },
        } = await getDriveFileAppProperties(files[0].id, accessToken)

        // TODO: Check if the current wallet (if there is one) is the same. If so, don't call restore
        await cwaasConnector.restoreWallet(backupData)
      }

      // TODO: Prompt user to choose from the backed up wallets
    },
    { onError: genericErrorToastCallback(toast) }
  )

  const verify = useSubmit(
    async () => {
      const recaptchaToken = await getRecaptchaToken(recaptchaRef)
      const walletClient = await cwaasConnector.getWalletClient()

      const verifyResult = await set.onSubmit(false, undefined, recaptchaToken, {
        walletClient,
        address: walletClient.account.address,
      })

      return verifyResult
    },
    { onError: genericErrorToastCallback(toast) }
  )

  const logInWithGoogle = useSubmit(() =>
    googleAuth
      .onOpen()
      .then(({ authData }) =>
        createOrRestoreWallet.onSubmit((authData as any)?.access_token)
      )
      .then((res) => ("data" in res ? verify.onSubmit() : null))
      .then((res) =>
        "data" in res ? connectAsync({ connector: cwaasConnector }) : null
      )
  )

  return (
    <>
      <Button
        mt="4"
        size="xl"
        isLoading={logInWithGoogle.isLoading}
        onClick={logInWithGoogle.onSubmit}
        colorScheme="blue"
        rightIcon={<Icon as={GoogleLogo} boxSize={6} />}
        justifyContent="space-between"
      >
        Google
      </Button>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        size="invisible"
      />
    </>
  )
}

const WalletSelectorModal = ({ isOpen, onClose, onOpen }: Props): JSX.Element => {
  const { connectors, error, connect, pendingConnector, isLoading } = useConnect()
  const cwaasConnector = connectors.find(
    ({ id }) => id === "cwaasWallet"
  ) as CWaaSConnector

  const { disconnect } = useDisconnect()
  const { isConnected, connector } = useAccount()
  const { captchaVerifiedSince } = useUserPublic()

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }

  const closeModalAndSendAction = () => {
    onClose()
    setTimeout(() => {
      disconnect()
    }, 200)
  }

  const { ready, set, keyPair } = useKeyPair()

  useEffect(() => {
    if (keyPair) onClose()
  }, [keyPair])

  const router = useRouter()

  useEffect(() => {
    if (
      ready &&
      !keyPair &&
      router.isReady &&
      !ignoredRoutes.includes(router.route)
    ) {
      const activate = connector.connect()
      if (typeof activate !== "undefined") {
        activate.finally(() => onOpen())
      }
    }
  }, [keyPair, ready, router])

  const shouldLinkToUser = useShouldLinkToUser()

  const { isDelegateConnection, setIsDelegateConnection, isInSafeContext } =
    useWeb3ConnectionManager()

  const isConnectedAndKeyPairReady = isConnected && ready

  const isWalletConnectModalActive = useIsWalletConnectModalActive()

  const recaptchaRef = useRef<ReCAPTCHA>()

  const [email, setEmail] = useState("")
  const [isOnboarding, setIsOnboarding] = useState(false)

  const createWallet = useSubmit(() => cwaasConnector.createWallet())

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={closeModalAndSendAction}
        closeOnOverlayClick={!isConnected || !!keyPair}
        closeOnEsc={!isConnected || !!keyPair}
        trapFocus={!isWalletConnectModalActive}
      >
        <ModalOverlay />
        <ModalCloseButton />
        <ModalContent data-test="wallet-selector-modal">
          {isOnboarding ? (
            <UserOnboarding
              createWallet={createWallet}
              emailAddress={email}
              onSuccess={() => {
                onClose()
                setIsOnboarding(false)
              }}
            />
          ) : (
            <>
              <ModalHeader display={"flex"}>
                <Box
                  {...((isConnectedAndKeyPairReady && !keyPair) ||
                  isDelegateConnection
                    ? {
                        w: "10",
                        opacity: 1,
                      }
                    : {
                        w: "0",
                        opacity: 0,
                      })}
                  transition="width .2s, opacity .2s"
                  mt="-1px"
                >
                  <IconButton
                    rounded={"full"}
                    aria-label="Back"
                    size="sm"
                    icon={<ArrowLeft size={20} />}
                    variant="ghost"
                    onClick={() => {
                      if (
                        isDelegateConnection &&
                        !(isConnectedAndKeyPairReady && !keyPair)
                      ) {
                        setIsDelegateConnection(false)
                        return
                      }
                      set.reset()
                      disconnect()
                    }}
                  />
                </Box>
                <Text>
                  {shouldLinkToUser
                    ? "Link address"
                    : isDelegateConnection
                    ? "Connect hot wallet"
                    : "Connect wallet"}
                </Text>
              </ModalHeader>
              <ModalBody>
                <CustomError
                  {...(set.error
                    ? {
                        error: set.error,
                        processError: (err: any) => {
                          if (err?.code === "ACTION_REJECTED") {
                            return {
                              title: "Rejected",
                              description: "Signature request has been rejected",
                            }
                          }

                          return {
                            title: "Error",
                            description:
                              err?.message ??
                              (typeof err === "string"
                                ? err
                                : err?.errors?.[0]?.msg),
                          }
                        },
                      }
                    : { error, processError: processConnectionError })}
                />
                {isConnectedAndKeyPairReady && !keyPair && (
                  <Text mb="6" animation={"fadeIn .3s .1s both"}>
                    Sign message to verify that you're the owner of this address.
                  </Text>
                )}
                <Stack spacing="0">
                  {connectors
                    .filter((conn) => isInSafeContext || conn.id !== "safe")
                    .map((conn) => (
                      <CardMotionWrapper key={conn.id}>
                        <ConnectorButton
                          connector={conn}
                          connect={connect}
                          isLoading={isLoading}
                          pendingConnector={pendingConnector}
                          error={error}
                        />
                      </CardMotionWrapper>
                    ))}
                  {!isDelegateConnection && (
                    <CardMotionWrapper>
                      <DelegateCashButton />
                    </CardMotionWrapper>
                  )}

                  {!connector && (
                    <>
                      <Box position="relative" paddingY="2">
                        <Divider />
                        <AbsoluteCenter bg="gray.700" px="4">
                          Or log in with email
                        </AbsoluteCenter>
                      </Box>

                      <InputGroup
                        size="lg"
                        mt="4"
                        as="form"
                        onSubmit={(event) => {
                          event.preventDefault()
                          setIsOnboarding(true)
                          // emailVerificationRequest.onSubmit({ emailAddress: email })
                        }}
                      >
                        <Input
                          value={email}
                          onFocus={() => {
                            if (!createWallet.isLoading && !createWallet.response) {
                              createWallet.onSubmit()
                            }
                          }}
                          onChange={({ target: { value } }) => {
                            setEmail(value)
                          }}
                          pr="8rem"
                          type={"email"}
                          placeholder="Enter email address"
                          required
                        />
                        <InputRightElement width="8rem">
                          <Button h="1.75rem" size="md" type="submit">
                            Continue
                          </Button>
                        </InputRightElement>
                      </InputGroup>

                      <GoogleLoginButton />
                    </>
                  )}
                </Stack>
                {isConnectedAndKeyPairReady && !keyPair && (
                  <>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      size="invisible"
                    />
                    <Box animation={"fadeIn .3s .1s both"}>
                      <ModalButton
                        size="xl"
                        mb="4"
                        colorScheme={"green"}
                        onClick={async () =>
                          set.onSubmit(
                            shouldLinkToUser,
                            undefined,
                            await getRecaptchaToken(
                              recaptchaRef,
                              !!captchaVerifiedSince
                            )
                          )
                        }
                        isLoading={set.isLoading || !ready}
                        isDisabled={!ready}
                        loadingText={
                          !ready
                            ? "Looking for keypairs"
                            : set.signLoadingText || "Check your wallet"
                        }
                      >
                        {shouldLinkToUser ? "Link address" : "Verify address"}
                      </ModalButton>
                    </Box>
                  </>
                )}
              </ModalBody>

              <ModalFooter mt="-4">
                {!isConnectedAndKeyPairReady ? (
                  <Stack textAlign="center" fontSize="sm" w="full">
                    <Text colorScheme="gray">
                      New to Ethereum wallets?{" "}
                      <Link
                        colorScheme="blue"
                        href="https://ethereum.org/en/wallets/"
                        isExternal
                      >
                        Learn more
                        <Icon as={ArrowSquareOut} mx="1" />
                      </Link>
                    </Text>

                    <Text colorScheme="gray">
                      By continuing, you agree to our{" "}
                      <Link
                        href="/privacy-policy"
                        fontWeight={"semibold"}
                        onClick={onClose}
                      >
                        Privacy Policy
                      </Link>{" "}
                      and
                      <Link
                        href="/terms-and-conditions"
                        fontWeight={"semibold"}
                        onClick={onClose}
                      >
                        Terms & conditions
                      </Link>
                    </Text>
                  </Stack>
                ) : (
                  <Stack textAlign="center" fontSize="sm" w="full">
                    <Text colorScheme={"gray"}>
                      Signing the message doesn't cost any gas
                    </Text>
                    <Text colorScheme="gray">
                      This site is protected by reCAPTCHA, so the Google{" "}
                      <Link
                        href="https://policies.google.com/privacy"
                        isExternal
                        fontWeight={"semibold"}
                      >
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="https://policies.google.com/terms"
                        isExternal
                        fontWeight={"semibold"}
                      >
                        Terms of Service
                      </Link>{" "}
                      apply
                    </Text>
                  </Stack>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default WalletSelectorModal
