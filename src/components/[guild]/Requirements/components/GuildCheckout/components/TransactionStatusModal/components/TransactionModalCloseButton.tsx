import { Button } from "@/components/ui/Button"
import { useTransactionStatusContext } from "../../TransactionStatusContext"

const TransactionModalCloseButton = (): JSX.Element => {
  const { onTxModalClose } = useTransactionStatusContext()

  return (
    <Button size="lg" colorScheme="info" className="w-full" onClick={onTxModalClose}>
      Close
    </Button>
  )
}

export { TransactionModalCloseButton }
