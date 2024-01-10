import GuildSelect from "requirements/common/GuildSelect"
import MinMaxAmount from "requirements/common/MinMaxAmount"
import { Requirement } from "types"

type Props = {
  baseFieldPath: string
  field?: Requirement
}

const PointsTotalAmount = ({ baseFieldPath, field }: Props): JSX.Element => (
  <>
    <GuildSelect baseFieldPath={baseFieldPath} />
    <MinMaxAmount baseFieldPath={baseFieldPath} field={field} />
  </>
)

export default PointsTotalAmount
