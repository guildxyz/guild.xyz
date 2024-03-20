import AbsoluteMinMaxTimeFormControls from "components/common/AbsoluteMinMaxTimeFormControls"

type Props = {
  baseFieldPath: string
}

const GithubAccountAge = ({ baseFieldPath }: Props) => (
  <AbsoluteMinMaxTimeFormControls
    minTimeFieldName={`${baseFieldPath}.data.minAmount`}
    maxTimeFieldName={`${baseFieldPath}.data.maxAmount`}
    minTimeLabel="Minimum registration date"
    maxTimeLabel="Maximum registration date"
  />
)

export default GithubAccountAge
