import { RequirementFormProps } from "requirements"
import MinMaxAmount from "requirements/common/MinMaxAmount"

const TwitterMinimumCount = ({ baseFieldPath, field }: RequirementFormProps) => (
  <MinMaxAmount
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    field={field}
    baseFieldPath={baseFieldPath}
    format="INT"
    hideSetMaxButton
  />
)

export default TwitterMinimumCount
