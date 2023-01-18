import { RequirementFormProps } from "requirements"
import ListingsOrHoldState from "./ListingsOrHoldState"

const Listings = (props: RequirementFormProps): JSX.Element => (
  <ListingsOrHoldState {...props} />
)

export default Listings
