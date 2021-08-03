import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import Modal from "components/common/Modal"
import { supportedChains } from "connectors"
import NetworkButton from "./components/NetworkButton"

const NetworkChangeModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Select network</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={3}>
          {supportedChains.map((chain) => (
            <NetworkButton key={chain} chain={chain} />
          ))}
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

export default NetworkChangeModal
