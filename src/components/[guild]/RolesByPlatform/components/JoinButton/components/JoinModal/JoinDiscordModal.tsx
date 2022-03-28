import {
  HStack,
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
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { CheckCircle } from "phosphor-react"
import platformsContent from "../../platformsContent"
import DCAuthButton from "./components/DCAuthButton"
import InviteLink from "./components/InviteLink"
import useDCAuthMachine from "./hooks/useDCAuthMachine"
import useJoinPlatform from "./hooks/useJoinPlatform"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const JoinDiscordModal = ({ isOpen, onClose }: Props): JSX.Element => {
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
    isSigning,
  } = useJoinPlatform("DISCORD", authState.context.id)

  const closeModal = () => {
    authSend("CLOSE_MODAL")
    onClose()
  }

  const handleJoin = async () => {
    authSend("HIDE_NOTIFICATION")
    onSubmit()
  }

  // if addressSignedMessage is already known, submit useJoinPlatform on DC auth
  /* useEffect(() => {
    if (
      authState.matches({ idKnown: "successNotification" }) &&
      addressSignedMessage
    )
      onSubmit()
  }, [authState]) */

  // if both addressSignedMessage and DC is already known, submit useJoinPlatform on modal open
  /* useEffect(() => {
    if (isOpen && addressSignedMessage && authState.matches("idKnown") && !response)
      onSubmit()
  }, [isOpen]) */

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={authState.context.error || joinError}
            processError={processJoinPlatformError}
          />
          {!response ? (
            <Text>{description}</Text>
          ) : (
            /** Negative margin bottom to offset the Footer's padding that's there anyway */
            <VStack spacing="6" mb="-8" alignItems="left">
              {response.alreadyJoined ? (
                <HStack spacing={6}>
                  <Icon
                    as={CheckCircle}
                    color="green.500"
                    boxSize="16"
                    weight="light"
                  />
                  <Text>
                    Seems like you've already joined the Discord server, you should
                    get access to the correct channels soon!
                  </Text>
                </HStack>
              ) : (
                <InviteLink inviteLink={response.inviteLink} />
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
            {(() => {
              if (!authState.matches("idKnown"))
                return (
                  <ModalButton disabled colorScheme="gray">
                    Verify address
                  </ModalButton>
                )
              if (isSigning)
                return <ModalButton isLoading loadingText="Check your wallet" />
              if (isLoading)
                return <ModalButton isLoading loadingText="Generating invite link" />
              if (joinError)
                return <ModalButton onClick={onSubmit}>Try again</ModalButton>
              if (authState.matches("idKnown") && !response)
                return <ModalButton onClick={handleJoin}>Verify address</ModalButton>
            })()}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinDiscordModal
