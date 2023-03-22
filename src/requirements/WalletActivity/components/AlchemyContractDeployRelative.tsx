import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormFields from "./MinMaxBlockNumberFormFields"
import TxCountFormField from "./TxCountFormField"

const AlchemyContractDeployRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormField
      baseFieldPath={baseFieldPath}
      formLabel="Number of contracts"
    />

    <MinMaxBlockNumberFormFields baseFieldPath={baseFieldPath} />
  </>
)

export default AlchemyContractDeployRelative
