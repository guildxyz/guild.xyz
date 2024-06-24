import RelativeMinMaxTimeFormControls from "components/common/RelativeMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements"

const CovalentFirstTxRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <RelativeMinMaxTimeFormControls
    minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
    maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
    minTimeLabel="First transaction newer than"
    maxTimeLabel="First transaction older than"
  />
)

export default CovalentFirstTxRelative
