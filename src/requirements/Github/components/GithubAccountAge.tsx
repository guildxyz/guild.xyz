import MinMaxAmountFormControls from "./MinMaxAmountFormControls"

type Props = {
  baseFieldPath: string
}

const GithubAccountAge = ({ baseFieldPath }: Props) => (
  <MinMaxAmountFormControls
    timestamp={false}
    baseFieldPath={baseFieldPath}
    minAmountLabel="Minimum registration date"
    maxAmountLabel="Maximum registration date"
  />
)

export default GithubAccountAge
