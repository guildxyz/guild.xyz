import { DialogBody, DialogFooter } from "@/components/ui/Dialog"
import { Timer, XCircle } from "@phosphor-icons/react/dist/ssr"
import { PropsWithChildren } from "react"
import { WaitForTransactionReceiptTimeoutError } from "viem"
import { useTransactionStatusContext } from "../../TransactionStatusContext"
import { TransactionModalCloseButton } from "./TransactionModalCloseButton"

const TxError = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const { txError } = useTransactionStatusContext()

  const isTimeout = txError instanceof WaitForTransactionReceiptTimeoutError

  return (
    <>
      <DialogBody>
        <div className="mb-10 flex items-center justify-center">
          {isTimeout ? (
            <Timer className="size-36 text-muted-foreground [&>*]:stroke-[6px]" />
          ) : (
            <XCircle className="size-36 text-destructive [&>*]:stroke-[6px]" />
          )}
        </div>

        {isTimeout ? (
          <p>
            Your transaction is processing. Due to high network traffic, it may take
            longer than usual. Check your wallet later for status updates. For
            persistent issues, please contact our support.
          </p>
        ) : (
          children
        )}
      </DialogBody>

      <DialogFooter>
        <TransactionModalCloseButton />
      </DialogFooter>
    </>
  )
}

export { TxError }
