import AbsoluteMinMaxTimeFormControls from "components/common/AbsoluteMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements/types"

const CovalentFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <AbsoluteMinMaxTimeFormControls
    minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
    maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
    minTimeLabel="First transaction made after"
    maxTimeLabel="First transaction made before"
  />
)

export default CovalentFirstTx
