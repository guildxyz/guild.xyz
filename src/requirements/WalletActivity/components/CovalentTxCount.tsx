import { RequirementFormProps } from "requirements"
import MinMaxAmountFormControls from "requirements/Github/components/MinMaxAmountFormControls"
import AddressFormControl from "./AddressFormControl"
import TxCountFormControl from "./TxCountFormControl"

const CovalentTxCount = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of transactions"
    />

    <AddressFormControl baseFieldPath={baseFieldPath} />

    <MinMaxAmountFormControls baseFieldPath={baseFieldPath} />
  </>
)

export default CovalentTxCount
