import { ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { AnimatePresence } from "framer-motion"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"
import InProgress from "./components/InProgress"
import Success from "./components/Success"
import TxError from "./components/TxError"

const InfoModal = (): JSX.Element => {
  const { isInfoModalOpen, txHash, txSuccess, txError } = useGuildCheckoutContext()

  const modalTitle = txError
    ? "Transaction failed"
    : txSuccess
    ? "Purchase successful"
    : txHash
    ? "Transaction is processing..."
    : "Buy requirement"

  return (
    <Modal isOpen={isInfoModalOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>

        <AnimatePresence>
          {txError ? (
            <TxError />
          ) : txSuccess ? (
            <Success tx={txHash} />
          ) : (
            <InProgress tx={txHash} />
          )}
        </AnimatePresence>
      </ModalContent>
    </Modal>
  )
}

export default InfoModal
