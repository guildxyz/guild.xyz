import { ProvidedValueDisplayProps } from "requirements"
import { scorers } from "../components/Score"

const GitcoinScoreProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  return scorers[requirement.data.id] ?? "Score in unknown scorer"
}

export default GitcoinScoreProvidedValue
