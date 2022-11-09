import { Requirement } from "types"
import pluralize from "utils/pluralize"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildMinGuildsRequirementCard = ({ requirement }: Props): JSX.Element => (
  <RequirementCard image="/requirementLogos/guild.png">
    {`Be a member of at least ${pluralize(requirement.data.minAmount, "guild")}`}
  </RequirementCard>
)

export default GuildMinGuildsRequirementCard
