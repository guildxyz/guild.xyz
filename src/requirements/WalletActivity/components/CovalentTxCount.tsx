import AbsoluteMinMaxTimeFormControls from "components/common/AbsoluteMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements"
import AddressFormControl from "./AddressFormControl"
import TxCountFormControl from "./TxCountFormControl"

const CovalentTxCount = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of transactions"
    />

    <AddressFormControl baseFieldPath={baseFieldPath} />

    <AbsoluteMinMaxTimeFormControls
      minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
      maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
      minTimeLabel="Count transactions from (date)"
      maxTimeLabel="Count transactions until (date)"
    />
  </>
)

export default CovalentTxCount
