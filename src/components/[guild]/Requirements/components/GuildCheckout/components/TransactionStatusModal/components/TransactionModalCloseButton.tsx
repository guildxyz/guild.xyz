import { Button } from "@/components/ui/Button"
import { useTransactionStatusContext } from "../../TransactionStatusContext"

const TransactionModalCloseButton = (): JSX.Element => {
  const { onTxModalClose } = useTransactionStatusContext()

  return (
    <Button
      size="lg"
      colorScheme="info"
      className="w-full"
      onClick={onTxModalClose}
      data-testid="tx-modal-close-button"
    >
      Close
    </Button>
  )
}

export { TransactionModalCloseButton }
