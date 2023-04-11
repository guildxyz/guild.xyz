import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import DataBlock from "./DataBlock"

type Props = {
  timestamp: number
}

const DataBlockWithRelativeDate = ({ timestamp }: Props): JSX.Element => (
  <DataBlock>{formatRelativeTimeFromNow(timestamp)}</DataBlock>
)

export default DataBlockWithRelativeDate
