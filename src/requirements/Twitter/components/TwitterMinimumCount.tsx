import MinMaxAmount from "requirements/common/MinMaxAmount"
import { RequirementFormProps } from "requirements/types"

const TwitterMinimumCount = ({ baseFieldPath, field }: RequirementFormProps) => (
  <MinMaxAmount
    field={field}
    baseFieldPath={baseFieldPath}
    format="INT"
    hideSetMaxButton
  />
)

export default TwitterMinimumCount
