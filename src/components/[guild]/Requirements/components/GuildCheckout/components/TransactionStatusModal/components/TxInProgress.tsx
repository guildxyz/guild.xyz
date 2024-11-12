import { DialogBody, DialogFooter } from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Separator"
import { CircleNotch } from "@phosphor-icons/react/dist/ssr"
import { PropsWithChildren } from "react"
import { TransactionLink } from "./TransactionLink"
import { TransactionModalCloseButton } from "./TransactionModalCloseButton"

const TxInProgress = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <>
    <DialogBody>
      <div className="mb-10 flex items-center justify-center">
        <CircleNotch className="size-36 animate-spin text-info [&>*]:stroke-[6px]" />
      </div>

      <p className="mb-2">
        The blockchain is working its magic... Your transaction should be confirmed
        shortly
      </p>

      <TransactionLink />

      {children && (
        <>
          <Separator className="mb-6" />
          {children}
        </>
      )}
    </DialogBody>

    <DialogFooter>
      <TransactionModalCloseButton />
    </DialogFooter>
  </>
)

export { TxInProgress }
