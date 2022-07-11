import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import useKeyPair from "hooks/useKeyPair"

const KeyPairModal = ({ children }) => {
  const { keyPair, ready, set } = useKeyPair()

  return (
    <>
      {children}
      <Modal
        isOpen={ready && !keyPair}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={() => {}}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remember wallet</ModalHeader>
          <ModalBody>
            Skip approving every interaction with your wallet by allowing Guild to
            remember you
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={set.onSubmit}
              isLoading={set.isLoading}
              loadingText="Generating keypair"
            >
              Remember me
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default KeyPairModal
