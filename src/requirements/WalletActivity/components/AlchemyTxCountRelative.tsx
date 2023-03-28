import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxCountFormField from "./TxCountFormField"

const AlchemyTxCountRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormField
      baseFieldPath={baseFieldPath}
      formLabel="Number of transactions"
    />

    <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} type="RELATIVE" />
  </>
)

export default AlchemyTxCountRelative
