import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const PoapRequirementCard = ({ requirement }: Props) => (
  <RequirementCard requirement={requirement}>
    <RequirementText>{`Own the ${requirement.data?.id} POAP`}</RequirementText>
  </RequirementCard>
)

export default PoapRequirementCard
