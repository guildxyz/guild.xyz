import { Link } from "@chakra-ui/react"
import { RPC } from "connectors"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const UnlockRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={`https://locksmith.unlock-protocol.com/lock/${requirement.address}/icon`}
  >
    {`Own a(n) `}
    <Link
      href={`${RPC[requirement.chain]?.blockExplorerUrls?.[0]}/token/${
        requirement.address
      }`}
      isExternal
      title="View on explorer"
    >
      {`${requirement.name} NFT`}
    </Link>
  </RequirementCard>
)

export default UnlockRequirementCard
