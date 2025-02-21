import RelativeMinMaxTimeFormControls from "components/common/RelativeMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements/types"
import { CovalentContractCallFields } from "./CovalentContractCallFields"

const CovalentContractCallCountRelative = ({
  baseFieldPath,
}: RequirementFormProps) => (
  <>
    <CovalentContractCallFields baseFieldPath={baseFieldPath} />

    <RelativeMinMaxTimeFormControls
      minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
      maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
      minTimeLabel="Contract call made after"
      maxTimeLabel="Contract call made before"
    />
  </>
)

export default CovalentContractCallCountRelative
