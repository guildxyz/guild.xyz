import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildMinGuildsRequirementCard = ({ requirement }: Props): JSX.Element => (
  <RequirementCard image="requirementLogos/guild.png">
    {`Be a member of at least ${requirement.data.minAmount} guilds`}
  </RequirementCard>
)

export default GuildMinGuildsRequirementCard
