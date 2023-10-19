import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { useAccount } from "wagmi"
import NetworkButtonsList from "./NetworkButtonsList"

const NetworkModal = ({ isOpen, onClose }) => {
  const { isConnected } = useAccount()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "lg", md: "2xl", lg: "4xl" }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isConnected ? "Supported networks" : "Select network"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={8}>
            It doesn't matter which supported chain you're connected to, it's only
            used to know your address and sign messages so each will work equally.
          </Text>
          <NetworkButtonsList networkChangeCallback={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NetworkModal
