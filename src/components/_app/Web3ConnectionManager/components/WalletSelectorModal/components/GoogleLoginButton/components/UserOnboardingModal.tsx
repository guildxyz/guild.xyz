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
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import {
  DotLottieCommonPlayer,
  DotLottiePlayer,
  PlayerEvents,
} from "@dotlottie/react-player"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import useCountdownSeconds from "hooks/useCountdownSeconds"
import { LockSimple, Question, Wallet } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import type { CWaaSConnector } from "waasConnector"
import { useConnect } from "wagmi"
import GoogleTerms from "../../GoogleTerms"

const UserOnboardingModal = ({
  isLoginLoading,
  isLoginSuccess,
  onClose,
  isOpen,
  isNewWallet,
}: {
  isLoginLoading: boolean
  isLoginSuccess: boolean
  onClose: () => void
  isOpen: boolean
  isNewWallet: boolean
}) => {
  const [isSuccessAnimDone, setIsSuccessAnimDone] = useState(false)
  const [accordionIndex, setAccordionIndex] = useState(0)

  const { captureEvent } = usePostHogContext()

  const { connectors, connect } = useConnect()
  const cwaasConnector = connectors.find(
    ({ id }) => id === "cwaasWallet"
  ) as CWaaSConnector

  // Timer to decide if resend button is disabled
  const { seconds, start } = useCountdownSeconds(5)

  const successPlayer = useRef<DotLottieCommonPlayer>()

  const isSuccess = !!isLoginSuccess && !!successPlayer

  // Play the success animation if everything was successful, and the player is ready
  useEffect(() => {
    if (!isSuccess) return
    successPlayer.current?.play()
  }, [isSuccess])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isLoginLoading
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
                    A wallet lets you store your digital assets like Guild Pins, NFTs
                    and other tokens. It's essential to have one to explore Guild and
                    all things web3!
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
                    {isLoginLoading
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
  )
}

export default UserOnboardingModal
