import DataBlock from "components/common/DataBlock"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

type Props = {
  timestamp: number
}

const DataBlockWithRelativeDate = ({ timestamp }: Props): JSX.Element => (
  <DataBlock>{formatRelativeTimeFromNow(timestamp)}</DataBlock>
)

export default DataBlockWithRelativeDate
