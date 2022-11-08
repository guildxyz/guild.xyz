import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildAdminRequirementCard = ({ requirement }: Props): JSX.Element => (
  <RequirementCard image="requirementLogos/guild.png">
    {`Be an admin in a guild with at least ${requirement.data.minAmount} members`}
  </RequirementCard>
)

export default GuildAdminRequirementCard
