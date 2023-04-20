import { RequirementFormProps } from "requirements"
import AddressFormControl from "./AddressFormControl"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxCountFormControl from "./TxCountFormControl"

const AlchemyTxCount = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of transactions"
    />

    <AddressFormControl baseFieldPath={baseFieldPath} />

    <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} />
  </>
)

export default AlchemyTxCount
