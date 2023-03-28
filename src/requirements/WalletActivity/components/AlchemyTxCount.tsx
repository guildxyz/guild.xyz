import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxCountFormControl from "./TxCountFormControl"

const AlchemyTxCount = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of transactions"
    />

    <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} />
  </>
)

export default AlchemyTxCount
