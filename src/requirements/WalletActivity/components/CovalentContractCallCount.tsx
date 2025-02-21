import AbsoluteMinMaxTimeFormControls from "components/common/AbsoluteMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements/types"
import { CovalentContractCallFields } from "./CovalentContractCallFields"

const CovalentContractCallCount = ({ baseFieldPath }: RequirementFormProps) => (
  <>
    <CovalentContractCallFields baseFieldPath={baseFieldPath} />

    <AbsoluteMinMaxTimeFormControls
      minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
      maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
      minTimeLabel="Contract call made after"
      maxTimeLabel="Contract call made before"
    />
  </>
)

export default CovalentContractCallCount
