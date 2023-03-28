import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxCountFormControl from "./TxCountFormControl"

const AlchemyTxCountRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of transactions"
    />

    <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} type="RELATIVE" />
  </>
)

export default AlchemyTxCountRelative
