import { RequirementFormProps } from "requirements"
import AddressFormControl from "./AddressFormControl"
import MinMaxBlockNumberFormControls from "./MinMaxBlockNumberFormControls"
import TxValueFormControl from "./TxValueFormControl"

const AlchemyTxValueRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <AddressFormControl baseFieldPath={baseFieldPath} />

    <TxValueFormControl baseFieldPath={baseFieldPath} />

    <MinMaxBlockNumberFormControls baseFieldPath={baseFieldPath} type="RELATIVE" />
  </>
)

export default AlchemyTxValueRelative
