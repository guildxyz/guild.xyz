import {
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { PropsWithChildren } from "react"

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
} & ModalContentProps

const BaseModal = ({
  isOpen,
  onClose,
  children,
  ...rest
}: PropsWithChildren<ModalProps>) => (
  <ChakraModal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent {...rest}>
      <ModalHeader>Discord Settings</ModalHeader>
      <ModalBody maxH="60vh" overflowY={"auto"}>
        {children}
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="green" onClick={onClose}>
          Done
        </Button>
      </ModalFooter>
    </ModalContent>
  </ChakraModal>
)

export default BaseModal
