import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const FreeRequirementCard = ({ requirement }: Props) => (
  <RequirementCard requirement={requirement}>
    <RequirementText>Anyone can join with an address</RequirementText>
  </RequirementCard>
)

export default FreeRequirementCard
