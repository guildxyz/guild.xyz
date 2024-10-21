import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"
import { scorers } from "../constants"

const GitcoinScoreProvidedValue = ({ requirement }: ProvidedValueDisplayProps) =>
  scorers[requirement.data?.id] ?? "Score in scorer"

export default GitcoinScoreProvidedValue
