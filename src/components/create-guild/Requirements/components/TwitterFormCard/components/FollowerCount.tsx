import MinMaxAmount from "components/create-guild/Requirements/components/MinMaxAmount"
import { Requirement } from "types"

const FollowerCount = ({ index, field }: { index: number; field?: Requirement }) => (
  <MinMaxAmount field={field} index={index} format="INT" hideSetMaxButton />
)

export default FollowerCount
