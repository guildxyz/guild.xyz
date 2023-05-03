import {
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"
import TxError from "./components/TxError"
import TxInProgress from "./components/TxInProgress"
import TxSuccess from "./components/TxSuccess"

type Props = {
  title: string
  successTitle?: string
  progressComponent?: JSX.Element
  successComponent?: JSX.Element
  successText?: string
  errorComponent?: JSX.Element
}

const TransactionStatusModal = ({
  title,
  successTitle,
  progressComponent,
  successComponent,
  successText,
  errorComponent,
}: Props): JSX.Element => {
  const { isInfoModalOpen, onInfoModalClose, txSuccess, txError, txHash } =
    useGuildCheckoutContext()

  return (
    <Modal
      isOpen={isInfoModalOpen}
      onClose={txSuccess ? onInfoModalClose : undefined}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {txError
            ? "Transaction failed"
            : txSuccess
            ? successTitle ?? "Successful payment"
            : txHash
            ? "Transaction is processing..."
            : title}
        </ModalHeader>
        {txSuccess && <ModalCloseButton />}

        {txError ? (
          <TxError>{errorComponent}</TxError>
        ) : txSuccess ? (
          <TxSuccess successText={successText}>{successComponent}</TxSuccess>
        ) : (
          <TxInProgress>{progressComponent}</TxInProgress>
        )}
      </ModalContent>
    </Modal>
  )
}

export default TransactionStatusModal
