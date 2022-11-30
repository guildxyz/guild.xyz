import { RequirementFormProps } from "requirements"
import NumberField from "./NumberField"
import VaultField from "./VaultField"

const Vaultshare = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <VaultField baseFieldPath={baseFieldPath} />

    <NumberField
      isRequired
      baseFieldPath={baseFieldPath}
      label="Minimum share percentage"
      fieldName="minShare"
      min={0.00001}
      max={1}
      format="FLOAT"
      helperText="A number between 0 and 1"
    />
  </>
)

export default Vaultshare
