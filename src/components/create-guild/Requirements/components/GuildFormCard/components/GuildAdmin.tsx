import MinAmountInput from "./MinAmountInput"

type Props = {
  baseFieldPath: string
}

const GuildAdmin = ({ baseFieldPath }: Props): JSX.Element => (
  <MinAmountInput
    baseFieldPath={baseFieldPath}
    label="Be admin of a guild with at least ... members "
    defaultValue={0}
  />
)

export default GuildAdmin
