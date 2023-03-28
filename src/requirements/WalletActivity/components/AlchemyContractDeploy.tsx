import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxCountFormField from "./TxCountFormField"

const AlchemyContractDeploy = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormField
      baseFieldPath={baseFieldPath}
      formLabel="Number of contracts"
    />

    <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} />
  </>
)

export default AlchemyContractDeploy
