import { HStack, Img, Link } from "@chakra-ui/react"
import { RPC } from "connectors"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const UnlockRequirementCard = ({ requirement }: Props) => (
  <RequirementCard requirement={requirement}>
    <HStack spacing={4} alignItems="center">
      <Img
        src={`https://locksmith.unlock-protocol.com/lock/${requirement.address}/icon`}
        alt={requirement.name}
        width={6}
        borderRadius="full"
      />
      <RequirementText>
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
      </RequirementText>
    </HStack>
  </RequirementCard>
)

export default UnlockRequirementCard
