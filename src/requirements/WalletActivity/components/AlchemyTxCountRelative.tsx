import { RequirementFormProps } from "requirements"
import MinMaxBlockNumberFormFields from "./MinMaxBlockNumberFormFields"
import TxCountFormField from "./TxCountFormField"

const AlchemyTxCountRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormField
      baseFieldPath={baseFieldPath}
      formLabel="Number of transactions"
    />

    <MinMaxBlockNumberFormFields baseFieldPath={baseFieldPath} />
  </>
)

export default AlchemyTxCountRelative
