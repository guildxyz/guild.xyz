import { Requirement } from "types"
import MinMaxAmount from "../../MinMaxAmount"

const SpotifyFollowerCount = ({
  index,
  field,
}: {
  index: number
  field: Requirement
}) => <MinMaxAmount field={field} index={index} format="INT" hideSetMaxButton />

export default SpotifyFollowerCount
