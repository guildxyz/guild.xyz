import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxCountFormControl from "./TxCountFormControl"

const AlchemyContractDeploy = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of contracts"
    />

    <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} />
  </>
)

export default AlchemyContractDeploy
