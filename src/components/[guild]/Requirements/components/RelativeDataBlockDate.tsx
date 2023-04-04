import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import DataBlock from "./DataBlock"

type Props = {
  data: number
}

const RelativeDataBlockDate = ({ data }: Props): JSX.Element => (
  <DataBlock>{formatRelativeTimeFromNow(data)}</DataBlock>
)

export default RelativeDataBlockDate
