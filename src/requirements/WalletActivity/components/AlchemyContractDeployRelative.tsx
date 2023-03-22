import { RequirementFormProps } from "requirements"
import BlockNumberFormField from "./BlockNumberFormField"
import TxCountFormField from "./TxCountFormField"

const AlchemyContractDeployRelative = ({
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
      formHelperText="TODO (FormHelperText)"
    />

    <BlockNumberFormField
      baseFieldPath={baseFieldPath}
      fieldName="minAmount"
      formLabel="Maximum block number"
      formHelperText="TODO (FormHelperText)"
    />
  </>
)

export default AlchemyContractDeployRelative
