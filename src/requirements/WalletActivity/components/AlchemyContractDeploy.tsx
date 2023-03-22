import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormFields from "./MinMaxBlockNumberFormFields"
import TxCountFormField from "./TxCountFormField"

const AlchemyContractDeploy = ({
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

export default AlchemyContractDeploy
