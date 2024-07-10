import MinAmountInput from "requirements/Guild/components/MinAmountInput"
import { RequirementFormProps } from "requirements/types"

const SoundMinAmount = ({ baseFieldPath }: RequirementFormProps) => (
  <MinAmountInput baseFieldPath={baseFieldPath} label="Minimum amount" />
)

export default SoundMinAmount
