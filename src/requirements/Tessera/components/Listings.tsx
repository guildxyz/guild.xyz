import { RequirementFormProps } from "requirements"
import NumberField from "./NumberField"

const Listings = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <NumberField
      baseFieldPath={baseFieldPath}
      label="Minimum amount"
      fieldName="minAmount"
    />

    <NumberField
      baseFieldPath={baseFieldPath}
      label="Minimum vault share"
      fieldName="minVaultShare"
      min={0.00001}
      max={1}
      format="FLOAT"
      helperText="A number between 0 and 1"
    />
  </>
)

export default Listings
