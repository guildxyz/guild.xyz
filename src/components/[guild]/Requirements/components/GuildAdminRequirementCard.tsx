import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildAdminRequirementCard = ({ requirement }: Props): JSX.Element => (
  <RequirementCard image="requirementLogos/guild.png">
    {`Be an admin in at least ${requirement.data.minAmount} guilds`}
  </RequirementCard>
)

export default GuildAdminRequirementCard
