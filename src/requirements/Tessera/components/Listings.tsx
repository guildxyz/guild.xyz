import { RequirementFormProps } from "requirements"
import NumberField from "./NumberField"

const Listings = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <NumberField
      isRequired
      baseFieldPath={baseFieldPath}
      label="Minimum amount"
      fieldName="minAmount"
      min={1}
    />

    <NumberField
      baseFieldPath={baseFieldPath}
      label="Minimum vault share"
      fieldName="minVaultShare"
      min={0.01}
      max={1}
      format="PERCENTAGE"
    />
  </>
)

export default Listings
