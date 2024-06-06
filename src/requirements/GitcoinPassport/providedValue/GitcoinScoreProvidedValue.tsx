import { ProvidedValueDisplayProps } from "requirements"
import { scorers } from "../components/Score"

const GitcoinScoreProvidedValue = ({ requirement }: ProvidedValueDisplayProps) =>
  scorers[requirement.data?.id] ?? "Score in scorer"

export default GitcoinScoreProvidedValue
