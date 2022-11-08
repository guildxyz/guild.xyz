import MinAmountInput from "./MinAmountInput"

type Props = {
  baseFieldPath: string
}

const MinGuilds = ({ baseFieldPath }: Props): JSX.Element => (
  <MinAmountInput baseFieldPath={baseFieldPath} label="Number of guilds" min={1} />
)

export default MinGuilds
