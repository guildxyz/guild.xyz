import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import shortenHex from "utils/shortenHex"

const Rep3Requirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={"/requirementLogos/rep3.png"}
      footer={<BlockExplorerUrl />}
      {...props}
    >
      {`Have a level ${requirement.data.id} rep3 membership NFT in DAO: `}
      <DataBlock>{requirement.name ?? shortenHex(requirement.address, 3)}</DataBlock>
    </Requirement>
  )
}

export default Rep3Requirement
