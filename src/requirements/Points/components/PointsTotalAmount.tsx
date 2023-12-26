import GuildSelect from "requirements/common/GuildSelect"
import MinMaxAmount from "requirements/common/MinMaxAmount"

type Props = {
  baseFieldPath: string
}

const PointsTotalAmount = ({ baseFieldPath }: Props): JSX.Element => (
  <>
    <GuildSelect baseFieldPath={baseFieldPath} />
    <MinMaxAmount baseFieldPath={baseFieldPath} field={null} />
  </>
)

export default PointsTotalAmount
