import { RequirementFormProps } from "requirements"
import MinAmountInput from "requirements/Guild/components/MinAmountInput"

const SoundMinAmount = ({ baseFieldPath }: RequirementFormProps) => (
  <MinAmountInput baseFieldPath={baseFieldPath} label="Minimum amount" />
)

export default SoundMinAmount
