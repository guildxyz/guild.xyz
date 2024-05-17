import { Modal, ModalContent, ModalOverlay, Spinner, VStack } from "@chakra-ui/react"
import { ReactNode } from "react"

// TODO: think of a more fun loader here
const LoadingModal = ({
  isOpen,
  children,
}: {
  isOpen: boolean
  children?: ReactNode
}) => (
  <Modal isOpen={isOpen} onClose={null} size={"xs"}>
    <ModalOverlay />
    <ModalContent py={8}>
      <VStack>
        <Spinner boxSize={12} mb={3} />
        {children}
      </VStack>
    </ModalContent>
  </Modal>
)

export default LoadingModal
