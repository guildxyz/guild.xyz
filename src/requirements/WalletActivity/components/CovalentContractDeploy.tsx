import AbsoluteMinMaxTimeFormControls from "components/common/AbsoluteMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements"
import TxCountFormControl from "./TxCountFormControl"

const CovalentContractDeploy = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of contracts"
    />

    <AbsoluteMinMaxTimeFormControls
      minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
      maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
    />
  </>
)

export default CovalentContractDeploy
