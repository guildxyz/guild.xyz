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
      min={0.01}
      max={1}
      format="PERCENTAGE"
    />
  </>
)

export default Vaultshare
