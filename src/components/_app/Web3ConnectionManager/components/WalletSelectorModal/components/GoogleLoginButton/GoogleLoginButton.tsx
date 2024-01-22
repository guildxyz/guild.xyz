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
  Img,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import {
  DotLottieCommonPlayer,
  DotLottiePlayer,
  PlayerEvents,
} from "@dotlottie/react-player"
import { useConnect as usePlatformConnect } from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import { publicClient } from "connectors"
import useCountdownSeconds from "hooks/useCountdownSeconds"
import useSetKeyPair from "hooks/useSetKeyPair"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { LockSimple, Question, Wallet } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import type { CWaaSConnector } from "waasConnector"
import { useConnect } from "wagmi"
import { connectorButtonProps } from "../ConnectorButton"
import GoogleTerms from "../GoogleTerms"
import useDriveOAuth from "./hooks/useDriveOAuth"
import {
  getDriveFileAppProperties,
  listWalletsOnDrive,
  uploadBackupDataToDrive,
} from "./utils/googleDrive"

const GoogleLoginButton = () => {
  const { captureEvent } = usePostHogContext()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { connectors, connectAsync, connect } = useConnect()
  const cwaasConnector = connectors.find(
    ({ id }) => id === "cwaasWallet"
  ) as CWaaSConnector

  const googleAuth = useDriveOAuth()

  const { onSubmit: onSetKeypairSubmit } = useSetKeyPair({
    onSuccess: () => captureEvent("[WaaS] Keypair verified"),
    onError: (err) => {
      captureEvent("[WaaS] Failed to verify keypair", { error: err })
      throw err
    },
    allowThrow: true,
  })
  const toast = useToast()

  const [isNewWallet, setIsNewWallet] = useState(false)

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

  const { onSubmit: onConnectGoogleSubmit } = usePlatformConnect({
    allowThrow: true,
    onSuccess: () => {
      captureEvent("[WaaS] Google platform connected")
    },
    onError: (err) => {
      captureEvent("[WaaS] Google platform connection failed", { error: err })
      throw new StopExecution()
    },
  })

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

      // TODO We could load the Player dynamically here
      return true
    },
    {
      onError: () => {
        onClose()
      },
    }
  )

  const successPlayer = useRef<DotLottieCommonPlayer>()
  const [isSuccessAnimDone, setIsSuccessAnimDone] = useState(false)
  const [accordionIndex, setAccordionIndex] = useState(0)

  const isSuccess = !!logInWithGoogle.response && !!successPlayer

  // Timer to decide if resend button is disabled
  const { seconds, start } = useCountdownSeconds(5)

  // Play the success animation if everything was successful, and the player is ready
  useEffect(() => {
    if (!isSuccess) return
    successPlayer.current?.play()
  }, [isSuccess])

  return (
    <>
      <Button
        mt="4"
        isLoading={logInWithGoogle.isLoading}
        onClick={logInWithGoogle.onSubmit}
        colorScheme="white"
        leftIcon={
          <Center boxSize={6}>
            <Img
              src={`/walletLogos/google.svg`}
              maxW={6}
              maxH={6}
              alt={`Google logo`}
            />
          </Center>
        }
        loadingText={googleAuth.isAuthenticating ? "Confirm in popup..." : "Loading"}
        {...connectorButtonProps}
      >
        Sign in with Google
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
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
                    <DotLottiePlayer
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "var(--chakra-sizes-24)",
                        height: "var(--chakra-sizes-24)",
                      }}
                      src="/success_lottie.json"
                      ref={successPlayer}
                      onEvent={(event) => {
                        if (event !== PlayerEvents.Complete) return

                        setIsSuccessAnimDone(true)
                        setAccordionIndex(1)
                        start()
                      }}
                      className="keep-colors"
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
                    <AccordionButton
                      px={1}
                      onClick={() => {
                        captureEvent("[WaaS] Click onboarding accordion", {
                          index: 0,
                        })
                        setAccordionIndex(0)
                      }}
                    >
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
                    <AccordionButton
                      px={1}
                      onClick={() => {
                        captureEvent("[WaaS] Click onboarding accordion", {
                          index: 1,
                        })
                        setAccordionIndex(1)
                      }}
                    >
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
                  onClose()
                  captureEvent("[WaaS] Wallet is connected")
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

export class StopExecution extends Error {}

export default GoogleLoginButton
