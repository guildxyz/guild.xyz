import { RequirementFormProps } from "requirements"
import NumberField from "./NumberField"

const Listings = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <NumberField
    isRequired
    baseFieldPath={baseFieldPath}
    label="Minimum amount"
    fieldName="minAmount"
    min={1}
  />
)

export default Listings
