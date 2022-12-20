import { RequirementFormProps } from "requirements"
import MinAmountInput from "requirements/Guild/components/MinAmountInput"

const SoundMinAmount = ({ baseFieldPath, field }: RequirementFormProps) => (
  <MinAmountInput baseFieldPath={baseFieldPath} label="Minimum amount" />
)

export default SoundMinAmount
