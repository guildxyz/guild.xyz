import Button from "components/common/Button"
import { useTransactionStatusContext } from "../../TransactionStatusContext"

const TransactionModalCloseButton = (): JSX.Element => {
  const { onTxModalClose } = useTransactionStatusContext()

  return (
    <Button size="lg" colorScheme="blue" w="full" onClick={onTxModalClose}>
      Close
    </Button>
  )
}

export default TransactionModalCloseButton
