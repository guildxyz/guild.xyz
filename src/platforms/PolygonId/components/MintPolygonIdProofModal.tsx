import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react"
import Content from "./MintPolygonIdProofModalContent"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const MintPolygonIdProofModal = ({ isOpen, onClose }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose} size={"xl"} colorScheme={"dark"}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />
      <Content />
    </ModalContent>
  </Modal>
)

export { MintPolygonIdProofModal }
