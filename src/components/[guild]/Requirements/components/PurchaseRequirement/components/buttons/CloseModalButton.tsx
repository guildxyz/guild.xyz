import Button from "components/common/Button"
import { usePurchaseRequirementContext } from "../PurchaseRequirementContex"

const CloseModalButton = (): JSX.Element => {
  const { onClose } = usePurchaseRequirementContext()

  return (
    <Button size="xl" colorScheme="blue" onClick={onClose}>
      Close
    </Button>
  )
}
export default CloseModalButton
