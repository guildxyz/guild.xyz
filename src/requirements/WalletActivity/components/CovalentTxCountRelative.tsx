import RelativeMinMaxTimeFormControls from "components/common/RelativeMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements"
import AddressFormControl from "./AddressFormControl"
import TxCountFormControl from "./TxCountFormControl"

const CovalentTxCountRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of transactions"
    />

    <AddressFormControl baseFieldPath={baseFieldPath} />

    <RelativeMinMaxTimeFormControls
      minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
      maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
      minTimeLabel="Count transactions after the last"
      maxTimeLabel="Count transactions before the last"
    />
  </>
)

export default CovalentTxCountRelative
