import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxCountFormField from "./TxCountFormField"

const AlchemyTxCount = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormField
      baseFieldPath={baseFieldPath}
      formLabel="Number of transactions"
    />

    <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} />
  </>
)

export default AlchemyTxCount
