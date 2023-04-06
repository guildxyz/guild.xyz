import RelativeMinMaxAmountFormControls from "./RelativeMinMaxAmountFormControls"

type Props = {
  baseFieldPath: string
}

const GithubAccountAgeRelative = ({ baseFieldPath }: Props) => (
  <RelativeMinMaxAmountFormControls
    baseFieldPath={baseFieldPath}
    // The labels are flipped intentionally!
    minAmountLabel="Maximum account age"
    maxAmountLabel="Minimum account age"
  />
)

export default GithubAccountAgeRelative
