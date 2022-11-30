import { RequirementFormProps } from "requirements"
import NumberField from "./NumberField"
import VaultField from "./VaultField"

const Hold = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <VaultField baseFieldPath={baseFieldPath} />

    <NumberField
      baseFieldPath={baseFieldPath}
      label="Minimum amount"
      fieldName="minAmount"
      min={1}
      isRequired
    />
  </>
)

export default Hold
