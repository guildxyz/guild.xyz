import RelativeMinMaxTimeFormControls from "components/common/RelativeMinMaxTimeFormControls"

type Props = {
  baseFieldPath: string
}

const GithubAccountAgeRelative = ({ baseFieldPath }: Props) => (
  <RelativeMinMaxTimeFormControls
    minTimeFieldName={`${baseFieldPath}.data.minAmount`}
    maxTimeFieldName={`${baseFieldPath}.data.maxAmount`}
    minTimeLabel="Minimum account age"
    maxTimeLabel="Maximum account age"
  />
)

export default GithubAccountAgeRelative
