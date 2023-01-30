import Button from "components/common/Button"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const CloseModalButton = (): JSX.Element => {
  const { onClose } = useGuildCheckoutContext()

  return (
    <Button size="xl" colorScheme="blue" onClick={onClose}>
      Close
    </Button>
  )
}
export default CloseModalButton
