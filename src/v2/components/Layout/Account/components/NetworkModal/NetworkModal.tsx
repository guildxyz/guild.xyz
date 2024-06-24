import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import NetworkButtonsList from "./NetworkButtonsList"

const NetworkModal = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size={{ base: "lg", md: "2xl", lg: "4xl" }}
  >
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Supported networks</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text mb={8}>
          It doesn't matter which supported chain you're connected to, it's only used
          to know your address and sign messages so each will work equally.
        </Text>
        <NetworkButtonsList networkChangeCallback={onClose} />
      </ModalBody>
    </ModalContent>
  </Modal>
)

export default NetworkModal
