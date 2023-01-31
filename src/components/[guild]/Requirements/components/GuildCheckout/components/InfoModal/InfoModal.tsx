import { ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { AnimatePresence } from "framer-motion"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"
import InProgress from "./components/InProgress"
import Success from "./components/Success"
import TxError from "./components/TxError"

const InfoModal = (): JSX.Element => {
  const { isInfoModalOpen, onInfoModalClose, processing, success, txError } =
    useGuildCheckoutContext()

  const modalTitle = processing
    ? "Transaction is processing..."
    : success
    ? "Purchase successful"
    : txError
    ? "Transaction failed"
    : "Buy requirement"

  return (
    <Modal isOpen={isInfoModalOpen} onClose={onInfoModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>

        <AnimatePresence>
          {processing ? (
            <InProgress tx="0x00000000" />
          ) : success ? (
            <Success tx="0x00000000" />
          ) : (
            <TxError />
          )}
        </AnimatePresence>
      </ModalContent>
    </Modal>
  )
}

export default InfoModal
