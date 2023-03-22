import { RequirementFormProps } from "requirements"
import BlockNumberFormField from "./BlockNumberFormField"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <BlockNumberFormField
    baseFieldPath={baseFieldPath}
    fieldName="minAmount"
    formLabel="Number of blocks"
    formHelperText="Wallet should be at least x blocks old"
    isRequired
  />
)

export default AlchemyFirstTx
