import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxCountFormField from "./TxCountFormField"

const AlchemyContractDeployRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormField
      baseFieldPath={baseFieldPath}
      formLabel="Number of contracts"
    />

    <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} type="RELATIVE" />
  </>
)

export default AlchemyContractDeployRelative
