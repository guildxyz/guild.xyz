import Button from "components/common/Button"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const TransactionModalCloseButton = (): JSX.Element => {
  const { onInfoModalClose } = useGuildCheckoutContext()

  return (
    <Button size="lg" colorScheme={"blue"} w="full" onClick={onInfoModalClose}>
      Close
    </Button>
  )
}

export default TransactionModalCloseButton
