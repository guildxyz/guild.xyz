import {
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { useTransactionStatusContext } from "../TransactionStatusContext"
import TxError from "./components/TxError"
import TxInProgress from "./components/TxInProgress"
import TxSuccess from "./components/TxSuccess"

type Props = {
  title: string
  successTitle?: string
  progressComponent?: JSX.Element
  successComponent?: JSX.Element
  successLinkComponent?: JSX.Element
  successText?: string
  errorComponent?: JSX.Element
}

const TransactionStatusModal = ({
  title,
  successTitle,
  progressComponent,
  successComponent,
  successLinkComponent,
  successText,
  errorComponent,
}: Props): JSX.Element => {
  const { isTxModalOpen, onTxModalClose, txSuccess, txError, txHash } =
    useTransactionStatusContext()

  return (
    <Modal isOpen={isTxModalOpen} onClose={txSuccess ? onTxModalClose : undefined}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {txError
            ? "Transaction failed"
            : txSuccess
              ? (successTitle ?? "Successful payment")
              : txHash
                ? "Transaction is processing..."
                : title}
        </ModalHeader>
        {txSuccess && <ModalCloseButton />}

        {txError ? (
          <TxError>{errorComponent}</TxError>
        ) : txSuccess ? (
          <TxSuccess
            successText={successText}
            successLinkComponent={successLinkComponent}
          >
            {successComponent}
          </TxSuccess>
        ) : (
          <TxInProgress>{progressComponent}</TxInProgress>
        )}
      </ModalContent>
    </Modal>
  )
}

export default TransactionStatusModal
