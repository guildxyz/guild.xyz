import Button from "components/common/Button"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const CloseModalButton = (): JSX.Element => {
  const { onClose } = useGuildCheckoutContext()

  return (
    <Button
      size="xl"
      colorScheme="blue"
      onClick={onClose}
      data-dd-action-name="CloseModalButton (GuildCheckout)"
    >
      Close
    </Button>
  )
}
export default CloseModalButton
