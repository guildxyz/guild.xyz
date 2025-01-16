import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { WaitForTransactionReceiptTimeoutError } from "viem"
import { useTransactionStatusContext } from "../TransactionStatusContext"
import { TxError } from "./components/TxError"
import { TxInProgress } from "./components/TxInProgress"
import { TxSuccess } from "./components/TxSuccess"

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
  const {
    isTxModalOpen,
    onTxModalClose,
    onTxModalOpen,
    txSuccess,
    txError,
    txHash,
  } = useTransactionStatusContext()

  return (
    <Dialog
      open={isTxModalOpen}
      onOpenChange={(open) => {
        if (open) {
          onTxModalOpen()
          return
        }

        if (!txSuccess) return

        onTxModalClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {txError instanceof WaitForTransactionReceiptTimeoutError
              ? "Timeout"
              : txError
                ? "Transaction failed"
                : txSuccess
                  ? (successTitle ?? "Successful payment")
                  : txHash
                    ? "Transaction is processing..."
                    : title}
          </DialogTitle>
        </DialogHeader>

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

        {txSuccess && <DialogCloseButton />}
      </DialogContent>
    </Dialog>
  )
}

export { TransactionStatusModal }
