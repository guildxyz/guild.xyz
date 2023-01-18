import { RequirementFormProps } from "requirements"
import ListingsOrHoldState from "./ListingsOrHoldState"

const HoldState = (props: RequirementFormProps): JSX.Element => (
  <ListingsOrHoldState {...props} isStateRequired />
)

export default HoldState
