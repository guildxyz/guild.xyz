import { ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { AnimatePresence } from "framer-motion"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"
import InProgress from "./components/InProgress"
import Success from "./components/Success"
import TxError from "./components/TxError"

type Props = {
  progressComponent?: JSX.Element
  successComponent?: JSX.Element
  errorComponent?: JSX.Element
}

const InfoModal = ({
  progressComponent,
  successComponent,
  errorComponent,
}: Props): JSX.Element => {
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
            <TxError>{errorComponent}</TxError>
          ) : txSuccess ? (
            <Success>{successComponent}</Success>
          ) : (
            <InProgress>{progressComponent}</InProgress>
          )}
        </AnimatePresence>
      </ModalContent>
    </Modal>
  )
}

export default InfoModal
