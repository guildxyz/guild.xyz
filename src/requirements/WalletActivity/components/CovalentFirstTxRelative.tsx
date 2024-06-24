import RelativeMinMaxTimeFormControls from "components/common/RelativeMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements"

const CovalentFirstTxRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <RelativeMinMaxTimeFormControls
    minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
    maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
    minTimeLabel="Wallet younger than"
    maxTimeLabel="Wallet older than"
  />
)

export default CovalentFirstTxRelative
