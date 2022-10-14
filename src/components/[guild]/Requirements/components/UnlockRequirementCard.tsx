import { Requirement } from "types"
import BlockExplorerUrl from "./common/BlockExplorerUrl"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const UnlockRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={`https://locksmith.unlock-protocol.com/lock/${requirement.address}/icon`}
    footer={<BlockExplorerUrl requirement={requirement} />}
  >
    {`Own a(n) ${requirement.name ?? "-"} NFT`}
  </RequirementCard>
)

export default UnlockRequirementCard
