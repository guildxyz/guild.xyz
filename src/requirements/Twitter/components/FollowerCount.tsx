import MinMaxAmount from "requirements/common/MinMaxAmount"
import { RequirementFormProps } from "types"

const FollowerCount = ({ baseFieldPath, field }: RequirementFormProps) => (
  <MinMaxAmount
    field={field}
    baseFieldPath={baseFieldPath}
    format="INT"
    hideSetMaxButton
  />
)

export default FollowerCount
