import {
  Modal,
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
import ModalButton from "components/common/ModalButton"
import useContainerRef from "components/community/hooks/useContainerRef"
import platformsContent from "../../platformsContent"
import useLeaveModalMachine from "./hooks/useLeaveModalMachine"
import processLeavePlatformMessage from "./utils/processLeavePlatformError"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const LeaveModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const {
    leave: { title, membershipDescription, leaveDescription, buttonText },
  } = platformsContent[platform]
  const [state, send] = useLeaveModalMachine(platform)
  const containerRef = useContainerRef()

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }

  return (
    <Modal portalProps={{ containerRef }} isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={state.context.error}
            processError={processLeavePlatformMessage}
          />
          <VStack spacing={5}>
            <Text>{membershipDescription}</Text>
            <Text>{leaveDescription}</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            isLoading={state.value === "fetching"}
            loadingText="In progress"
            onClick={() => send("LEAVE")}
          >
            {buttonText}
          </ModalButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LeaveModal
