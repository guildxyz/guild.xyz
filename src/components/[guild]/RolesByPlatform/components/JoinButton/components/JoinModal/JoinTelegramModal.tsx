import {
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
import useUser from "components/[guild]/hooks/useUser"
import platformsContent from "../../platformsContent"
import InviteLink from "./components/InviteLink"
import useJoinPlatform from "./hooks/useJoinPlatform"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const JoinTelegramModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const { telegramId: telegramIdFromDb } = useUser()
  const {
    title,
    join: { description },
  } = platformsContent.TELEGRAM
  const {
    response,
    isLoading,
    onSubmit,
    error: joinError,
    isSigning,
  } = useJoinPlatform("TELEGRAM", telegramIdFromDb?.toString())

  // if both addressSignedMessage and TG is already known, submit useJoinPlatform on modal open
  /*useEffect(() => {
    if (isOpen && addressSignedMessage && telegramIdFromDb && !response) onSubmit()
  }, [isOpen])*/

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error error={joinError} processError={processJoinPlatformError} />
          {!response ? (
            <Text>{description}</Text>
          ) : (
            /** Negative margin bottom to offset the Footer's padding that's there anyway */
            <VStack spacing="6" mb="-8" alignItems="left">
              <InviteLink inviteLink={response.inviteLink} />
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {/* margin is applied on AuthButton, so there's no jump when it collapses and unmounts */}
          <VStack spacing="0" alignItems="strech" w="full">
            {(() => {
              if (isSigning)
                return <ModalButton isLoading loadingText="Check your wallet" />
              if (isLoading)
                return <ModalButton isLoading loadingText="Generating invite link" />
              if (joinError)
                return <ModalButton onClick={onSubmit}>Try again</ModalButton>
              if (!response)
                return <ModalButton onClick={onSubmit}>Verify address</ModalButton>
            })()}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinTelegramModal
