import {
  Flex,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import usePersonalSign from "hooks/usePersonalSign"
import { ArrowSquareOut, CheckCircle } from "phosphor-react"
import QRCode from "qrcode.react"
import { useEffect } from "react"
import platformsContent from "../../platformsContent"
import DCAuthButton from "./components/DCAuthButton"
import useDCAuthMachine from "./hooks/useDCAuthMachine"
import useJoinPlatform from "./hooks/useJoinPlatform"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
  roleId: number
}

const JoinDiscordModal = ({ isOpen, onClose, roleId }: Props): JSX.Element => {
  const {
    title,
    join: { description },
  } = platformsContent.DISCORD
  const [authState, authSend] = useDCAuthMachine()
  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
  } = useJoinPlatform("DISCORD", authState.context.id, roleId)
  const {
    error: signError,
    isSigning,
    addressSignedMessage,
    callbackWithSign,
    removeError: removeSignError,
  } = usePersonalSign()

  const closeModal = () => {
    authSend("CLOSE_MODAL")
    removeSignError()
    onClose()
  }

  const handleJoin = async () => {
    authSend("HIDE_NOTIFICATION")
    try {
      await callbackWithSign(onSubmit)()
    } catch {}
  }

  // if addressSignedMessage is already known, submit useJoinPlatform on DC auth
  useEffect(() => {
    if (
      authState.matches({ idKnown: "successNotification" }) &&
      addressSignedMessage
    )
      onSubmit()
  }, [authState])

  // if both addressSignedMessage and DC is already known, submit useJoinPlatform on modal open
  useEffect(() => {
    if (isOpen && addressSignedMessage && authState.matches("idKnown") && !response)
      onSubmit()
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={authState.context.error || joinError || signError}
            processError={processJoinPlatformError}
          />
          {!response ? (
            <Text>{description}</Text>
          ) : (
            /** Negative margin bottom to offset the Footer's padding that's there anyway */
            <VStack spacing="6" mb="-8">
              {response.alreadyJoined ? (
                <Flex alignItems="center">
                  <Icon
                    as={CheckCircle}
                    color="green.500"
                    boxSize="16"
                    weight="light"
                  />
                  <Text ml="6">
                    Seems like you've already joined the Discord server, you should
                    get access to the correct channels soon!
                  </Text>
                </Flex>
              ) : (
                <>
                  <Text>Here’s your invite link:</Text>
                  <Link href={response.inviteLink} colorScheme="blue" isExternal>
                    {response.inviteLink}
                    <Icon as={ArrowSquareOut} mx="2" />
                  </Link>
                  <QRCode size={150} value={response.inviteLink} />
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {/* margin is applied on AuthButton, so there's no jump when it collapses and unmounts */}
          <VStack spacing="0" alignItems="strech" w="full">
            {!isLoading && !response && (
              <DCAuthButton state={authState} send={authSend} />
            )}
            {!addressSignedMessage
              ? (() => {
                  if (!authState.matches("idKnown"))
                    return (
                      <ModalButton disabled colorScheme="gray">
                        Verify address
                      </ModalButton>
                    )
                  if (isSigning)
                    return <ModalButton isLoading loadingText="Check your wallet" />
                  return (
                    <ModalButton onClick={handleJoin}>Verify address</ModalButton>
                  )
                })()
              : (() => {
                  if (isLoading)
                    return (
                      <ModalButton isLoading loadingText="Generating invite link" />
                    )
                  if (joinError)
                    return <ModalButton onClick={onSubmit}>Try again</ModalButton>
                })()}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinDiscordModal
