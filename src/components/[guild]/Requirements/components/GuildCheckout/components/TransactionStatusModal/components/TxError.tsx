import { DialogBody, DialogFooter } from "@/components/ui/Dialog"
import { XCircle } from "@phosphor-icons/react/dist/ssr"
import { PropsWithChildren } from "react"
import { TransactionModalCloseButton } from "./TransactionModalCloseButton"

const TxError = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <>
    <DialogBody>
      <div className="mb-10 flex items-center justify-center">
        <XCircle className="size-36 text-destructive [&>*]:stroke-[6px]" />
      </div>

      {children}
    </DialogBody>

    <DialogFooter>
      <TransactionModalCloseButton />
    </DialogFooter>
  </>
)

export { TxError }
