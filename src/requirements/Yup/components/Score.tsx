import { RequirementFormProps } from "requirements"
import MinScoreField from "./MinScoreField"

const Score = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <MinScoreField baseFieldPath={baseFieldPath} />
)

export default Score
