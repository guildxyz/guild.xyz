import MinMaxAmountFormControls from "./MinMaxAmountFormControls"

type Props = {
  baseFieldPath: string
}

const GithubAccountAge = ({ baseFieldPath }: Props) => (
  <MinMaxAmountFormControls
    baseFieldPath={baseFieldPath}
    minAmountLabel="Minimum registration date"
    maxAmountLabel="Maximum registration date"
  />
)

export default GithubAccountAge
