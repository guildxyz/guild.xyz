import { RequirementFormProps } from "requirements"
import BlockNumberFormField from "./BlockNumberFormField"

const AlchemyFirstTxRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <BlockNumberFormField
    baseFieldPath={baseFieldPath}
    fieldName="minAmount"
    formLabel="Block number"
    formHelperText="Wallet should be at least x blocks old"
    isRequired
  />
)

export default AlchemyFirstTxRelative
