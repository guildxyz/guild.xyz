import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Collapse,
  Icon,
  IconButton,
  Img,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { IPlayerProps, Player } from "@lottiefiles/react-lottie-player"
import MetaMaskOnboarding from "@metamask/onboarding"
import useOauthPopupWindow from "components/[guild]/JoinModal/hooks/useOauthPopupWindow"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import { useKeyPair } from "components/_app/KeyPairProvider"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import CopyableAddress from "components/common/CopyableAddress"
import { Error as CustomError } from "components/common/Error"
import GuildAvatar from "components/common/GuildAvatar"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { publicClient } from "connectors"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import {
  ArrowLeft,
  ArrowSquareOut,
  LockSimple,
  Question,
  Wallet,
} from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { mutate } from "swr"
import { fetcherWithSign } from "utils/fetcher"
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
import GoogleTerms from "./components/GoogleTerms"
import useCountdownSeconds from "./hooks/useCountdownSeconds"
import useIsWalletConnectModalActive from "./hooks/useIsWalletConnectModalActive"
import useShouldLinkToUser from "./hooks/useShouldLinkToUser"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

type LottieInstance = Parameters<IPlayerProps["lottieRef"]>[0]

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
  const onboardingModal = useDisclosure()
  const recaptchaRef = useRef<ReCAPTCHA>()
  const { connectors, connectAsync, connect } = useConnect()
  const cwaasConnector = connectors.find(
    ({ id }) => id === "cwaasWallet"
  ) as CWaaSConnector

  // TODO: Retain access code until it expires (or gets revoked), so if something fails, and has to retry, doesn't need to OAuth again
  const googleAuth = useOauthPopupWindow("GOOGLE_DRIVE_FOR_WALLET_BACKUP_ONLY")

  const { set } = useKeyPair()
  const toast = useToast()

  const [isNewWallet, setIsNewWallet] = useState(false)

  const createOrRestoreWallet = useSubmit(
    async (accessToken: string) => {
      const { files } = await listWalletsOnDrive(accessToken)

      if (files.length <= 0) {
        setIsNewWallet(true)
      }

      onboardingModal.onOpen()

      if (files.length <= 0) {
        const { wallet, account } = await cwaasConnector.createWallet()
        await uploadBackupDataToDrive(wallet.backup, account.address, accessToken)
        return true
      } /* if (files.length == 1) */ else {
        const {
          appProperties: { backupData },
        } = await getDriveFileAppProperties(files[0].id, accessToken)

        // TODO: Check if the current wallet (if there is one) is the same. If so, don't call restore
        await cwaasConnector.restoreWallet(backupData)
        return false
      }

      // TODO: Prompt user to choose from the backed up wallets
    },
    {
      onError: (error) => {
        console.error(error)
        genericErrorToastCallback(toast)(error)
      },
    }
  )

  const verify = useSubmit(
    async () => {
      const recaptchaToken = await getRecaptchaToken(recaptchaRef)
      const walletClient = await cwaasConnector.getWalletClient()

      const verifyResult = await set.onSubmit(
        false,
        undefined,
        recaptchaToken,
        {
          walletClient,
          address: walletClient.account.address,
        },
        true
      )

      return verifyResult
    },
    { onError: genericErrorToastCallback(toast) }
  )
  // TODO use this, need to pass sign props
  // const connectGoogle = usePlatformConnect()
  const connectGoogle = useSubmit(async ({ authData, userId, keyPair }) => {
    const walletClient = await cwaasConnector.getWalletClient()

    const result = await fetcherWithSign(
      {
        keyPair,
        walletClient,
        address: walletClient.account.address,
        publicClient: publicClient({}),
        ts: Date.now(),
      },
      `/v2/users/${walletClient.account.address}/platform-users`,
      {
        method: "POST",
        body: {
          platformName: "GOOGLE",
          authData,
        },
      }
    )

    if (userId) {
      await mutate(
        [`/v2/users/${userId}/profile`, { method: "GET", body: {} }],
        (prev) => ({
          ...prev,
          platformUsers: [...(prev?.platformUsers ?? []), result],
        })
      )
    }

    return result
  })

  const logInWithGoogle = useSubmit(
    async () => {
      // 1) Google OAuth
      const { authData } = await googleAuth.onOpen()

      // 2) Create or Restore wallet
      const isNew = await createOrRestoreWallet.onSubmit(
        (authData as any)?.access_token,
        true
      )

      const [{ keyPair = undefined } = {}, , { id: userId = undefined } = {}] =
        await verify.onSubmit(null, true)

      await connectGoogle
        .onSubmit({ authData, userId, keyPair }, true)
        .catch(() => {})

      if (!isNew) {
        await connectAsync({ connector: cwaasConnector })
        onboardingModal.onClose()
      }

      // TODO We could load the Player dynamically here
      return true
    },
    {
      onError: () => {
        onboardingModal.onClose()
      },
    }
  )

  const [successPlayer, setSuccessPlayer] = useState<LottieInstance>()
  const [isSuccessAnimDone, setIsSuccessAnimDone] = useState(false)
  const [accordionIndex, setAccordionIndex] = useState(0)

  const isSuccess = !!logInWithGoogle.response && !!successPlayer

  // Timer to decide if resend button is disabled
  const { seconds, start } = useCountdownSeconds(5)

  // Play the success animation if everything was successful, and the player is ready
  useEffect(() => {
    if (!isSuccess) return
    successPlayer.play()

    const animDone = () => {
      setIsSuccessAnimDone(true)
      setAccordionIndex(1)
      start()
    }

    successPlayer.addEventListener("complete", animDone)

    // return () => {
    //   successPlayer.removeEventListener("complete", animDone)
    // }
  }, [isSuccess])

  return (
    <>
      <Button
        mt="4"
        size="xl"
        isLoading={logInWithGoogle.isLoading}
        onClick={logInWithGoogle.onSubmit}
        colorScheme="white"
        leftIcon={
          <Center boxSize={6}>
            <Img
              src={`/walletLogos/google.png`}
              maxW={6}
              maxH={6}
              alt={`Google logo`}
            />
          </Center>
        }
        justifyContent="start"
        gap={3}
        loadingText={googleAuth.isAuthenticating ? "Confirm in popup..." : "Loading"}
      >
        Sign in with Google
      </Button>
      {/* Maybe move ReCAPTCHA to _app to avoid duplication */}
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        size="invisible"
      />

      <Modal isOpen={onboardingModal.isOpen} onClose={onboardingModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {logInWithGoogle.isLoading
              ? isNewWallet
                ? "Generating a wallet for you..."
                : "Restoring your wallet..."
              : "Your new wallet"}
          </ModalHeader>
          <ModalBody>
            <Stack alignItems={"center"} gap={8}>
              <Stack alignItems={"center"}>
                <Box
                  backgroundColor={"blackAlpha.200"}
                  boxSize={20}
                  borderRadius={"full"}
                  position={"relative"}
                >
                  {!isSuccess && (
                    <>
                      <Spinner w="full" h="full" speed="0.8s" thickness={"4px"} />
                      <Icon
                        as={Wallet}
                        position={"absolute"}
                        top={"50%"}
                        left={"50%"}
                        transform={"translate(-50%, -50%)"}
                        boxSize={7}
                      />
                    </>
                  )}

                  <Collapse in={!isSuccessAnimDone}>
                    <Player
                      // keepLastFrame
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "var(--chakra-sizes-24)",
                        height: "var(--chakra-sizes-24)",
                      }}
                      src="/success_lottie.json"
                      lottieRef={(player) => {
                        setSuccessPlayer(player)
                      }}
                    />
                  </Collapse>

                  {isSuccessAnimDone && (
                    <Center h="full">
                      <GuildAvatar
                        address={cwaasConnector?._currentAddress?.address}
                      />
                    </Center>
                  )}
                </Box>

                {isSuccessAnimDone ? (
                  <CopyableAddress
                    decimals={5}
                    address={cwaasConnector?._currentAddress?.address ?? ""}
                  />
                ) : (
                  isNewWallet && <Box height="1.5rem" />
                )}
              </Stack>

              {isNewWallet && (
                <Accordion index={accordionIndex}>
                  <AccordionItem borderTop={"none"} pb={2}>
                    <AccordionButton px={1} onClick={() => setAccordionIndex(0)}>
                      <Question size={18} />
                      <Text fontWeight={600} ml={2} flexGrow={1} textAlign={"left"}>
                        What's a wallet?
                      </Text>

                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} pl={8} pt={0} color={"whiteAlpha.600"}>
                      A wallet lets you store your digital assets like Guild Pins,
                      NFTs and other tokens. It's essential to have one to explore
                      Guild and all things web3!
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem borderBottom={"none"} pt={2}>
                    <AccordionButton px={1} onClick={() => setAccordionIndex(1)}>
                      <LockSimple size={18} />
                      <Text fontWeight={600} ml={2} flexGrow={1} textAlign={"left"}>
                        How can I access my wallet?
                      </Text>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} pl={8} pt={0} color={"whiteAlpha.600"}>
                      {logInWithGoogle.isLoading
                        ? "Your wallet has a private key that we'll save to your Google Drive. As long as it's there, you'll be able to restore your wallet / sign in to Guild with Google. If you lose it, we won't be able to restore your account!"
                        : "Your wallet has a private key that we've saved to your Google Drive. As long as it's there, you'll be able to restore your wallet / sign in to Guild with Google. If you lose it, we won't be able to restore your account!"}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            {isSuccessAnimDone ? (
              <Button
                w={"full"}
                size="lg"
                colorScheme="green"
                isDisabled={seconds > 0}
                onClick={() => {
                  connect({ connector: cwaasConnector })
                  onboardingModal.onClose()
                }}
              >
                {seconds > 0 ? `Wait ${seconds} sec...` : "Got it"}
              </Button>
            ) : (
              <GoogleTerms />
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const WalletSelectorModal = ({ isOpen, onClose, onOpen }: Props): JSX.Element => {
  const { connectors, error, connect, pendingConnector, isLoading } = useConnect()

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
          <ModalHeader display={"flex"}>
            <Box
              {...((isConnectedAndKeyPairReady && !keyPair) || isDelegateConnection
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
                          (typeof err === "string" ? err : err?.errors?.[0]?.msg),
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
              {!connector && (
                <>
                  <GoogleLoginButton />
                  <Text
                    mt={6}
                    mb={2}
                    textTransform={"uppercase"}
                    fontSize={"xs"}
                    fontWeight={700}
                    color={"gray"}
                  >
                    Or connect with wallet
                  </Text>
                </>
              )}

              {connectors
                .filter(
                  (conn) =>
                    (isInSafeContext || conn.id !== "safe") &&
                    (!!connector || conn.id !== "cwaasWallet")
                )
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
                        await getRecaptchaToken(recaptchaRef, !!captchaVerifiedSince)
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
                <GoogleTerms />
              </Stack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WalletSelectorModal
