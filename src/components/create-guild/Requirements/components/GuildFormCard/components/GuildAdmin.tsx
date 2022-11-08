import MinAmountInput from "./MinAmountInput"

type Props = {
  baseFieldPath: string
}

const GuildAdmin = ({ baseFieldPath }: Props): JSX.Element => (
  <MinAmountInput
    baseFieldPath={baseFieldPath}
    label="Members count"
    helperText="Minimum amount of guild members"
  />
)

export default GuildAdmin
