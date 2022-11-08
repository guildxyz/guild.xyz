import MinMaxAmount from "components/create-guild/Requirements/components/MinMaxAmount"
import { FormCardProps } from "types"

const FollowerCount = ({ baseFieldPath, field }: FormCardProps) => (
  <MinMaxAmount
    field={field}
    baseFieldPath={baseFieldPath}
    format="INT"
    hideSetMaxButton
  />
)

export default FollowerCount
