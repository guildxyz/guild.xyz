import {
  ModalBody,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
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
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    scrollBehavior="inside"
    colorScheme={"dark"}
  >
    <ModalOverlay />
    <ModalContent {...rest}>
      <ModalHeader>Discord settings</ModalHeader>
      <ModalBody>{children}</ModalBody>

      <ModalFooter>
        <Button colorScheme="green" onClick={onClose}>
          Done
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

export default BaseModal
