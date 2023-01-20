import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import BlockExplorerUrl from "../../components/[guild]/Requirements/components/BlockExplorerUrl"

const UnlockRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={`https://locksmith.unlock-protocol.com/lock/${requirement.address}/icon`}
      footer={<BlockExplorerUrl />}
      {...props}
    >
      {`Own a(n) ${requirement.name ?? "- (Unlock)"} NFT`}
    </Requirement>
  )
}

export default UnlockRequirement
