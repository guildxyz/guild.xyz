import { RequirementFormProps } from "requirements"
import BlockNumberFormField from "./BlockNumberFormField"
import TxCountFormField from "./TxCountFormField"

const AlchemyContractDeploy = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormField
      baseFieldPath={baseFieldPath}
      formLabel="Number of contracts"
    />

    <BlockNumberFormField
      baseFieldPath={baseFieldPath}
      fieldName="minAmount"
      formLabel="Minimum block number"
      formHelperText="Start checking from this block"
    />

    <BlockNumberFormField
      baseFieldPath={baseFieldPath}
      fieldName="minAmount"
      formLabel="Maximum block number"
      formHelperText="Stop checking at this block"
    />
  </>
)

export default AlchemyContractDeploy
