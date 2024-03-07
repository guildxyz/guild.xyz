import RelativeMinMaxTimeFormControls from "components/common/RelativeMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements"
import TxCountFormControl from "./TxCountFormControl"

const CovalentContractDeployRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of contracts"
    />

    <RelativeMinMaxTimeFormControls
      minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
      maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
    />
  </>
)

export default CovalentContractDeployRelative
