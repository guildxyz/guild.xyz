import { RequirementFormProps } from "requirements"
import NumberField from "./NumberField"
import VaultField from "./VaultField"

const Vaultshare = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <VaultField baseFieldPath={baseFieldPath} />

    <NumberField
      baseFieldPath={baseFieldPath}
      label="Minimum share percentage"
      fieldName="minShare"
      max={100}
      isRequired
    />
  </>
)

export default Vaultshare
