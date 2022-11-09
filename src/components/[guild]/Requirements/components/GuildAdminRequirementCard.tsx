import { Requirement } from "types"
import pluralize from "utils/pluralize"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildAdminRequirementCard = ({ requirement }: Props): JSX.Element => (
  <RequirementCard image="requirementLogos/guild.png">
    {"Be an admin in "}
    {requirement.data.minAmount === 0
      ? "any guild"
      : `a guild with at least ${pluralize(requirement.data.minAmount, "member")}`}
  </RequirementCard>
)

export default GuildAdminRequirementCard
