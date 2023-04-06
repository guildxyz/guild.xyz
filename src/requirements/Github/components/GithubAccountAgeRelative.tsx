import RelativeMinMaxAmountFormControls from "./RelativeMinMaxAmountFormControls"

type Props = {
  baseFieldPath: string
}

const GithubAccountAgeRelative = ({ baseFieldPath }: Props) => (
  <RelativeMinMaxAmountFormControls
    baseFieldPath={baseFieldPath}
    minAmountLabel="Minimum account age"
    maxAmountLabel="Maximum account age"
  />
)

export default GithubAccountAgeRelative
