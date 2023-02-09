import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

const UnlockRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      image={`https://locksmith.unlock-protocol.com/lock/${requirement.address}/icon`}
      footer={<BlockExplorerUrl />}
      {...props}
    >
      {`Own a(n) ${requirement.name ?? "- (Unlock)"} NFT`}
    </Requirement>
  )
}

export default UnlockRequirement
