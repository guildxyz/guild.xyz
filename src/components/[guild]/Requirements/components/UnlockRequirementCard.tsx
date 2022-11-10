import { RequirementCardComponentProps } from "types"
import BlockExplorerUrl from "./common/BlockExplorerUrl"
import RequirementCard from "./common/RequirementCard"

const UnlockRequirementCard = ({
  requirement,
  ...rest
}: RequirementCardComponentProps) => (
  <RequirementCard
    image={`https://locksmith.unlock-protocol.com/lock/${requirement.address}/icon`}
    footer={<BlockExplorerUrl requirement={requirement} />}
    {...rest}
  >
    {`Own a(n) ${requirement.name ?? "-"} NFT`}
  </RequirementCard>
)

export default UnlockRequirementCard
