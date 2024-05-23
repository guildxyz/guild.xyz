import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"

const ExportMembersModal = ({ isOpen, onClose }) => {
  const toast = useToast()

  const onExport = () => {
    toast({
      status: "info",
      title: "Export not implemented yet",
      description:
        "It might take some time to finish based on the number of members",
      duration: 2000,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Members exports</ModalHeader>
        <ModalBody>
          <Text mb="10">Your exports will appear here</Text>
          <Button colorScheme="green" w="full" onClick={onExport}>
            Export currently filtered members (123)
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ExportMembersModal
