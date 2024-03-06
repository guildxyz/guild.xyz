import { RequirementFormProps } from "requirements"
import MinMaxAmountFormControls from "requirements/Github/components/MinMaxAmountFormControls"
import TxCountFormControl from "./TxCountFormControl"

const CovalentContractDeployRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <TxCountFormControl
      baseFieldPath={baseFieldPath}
      formLabel="Number of contracts"
    />

    <MinMaxAmountFormControls baseFieldPath={baseFieldPath} type="RELATIVE" />
  </>
)

export default CovalentContractDeployRelative
