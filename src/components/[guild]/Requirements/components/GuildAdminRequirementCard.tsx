import { Requirement } from "types"
import pluralize from "utils/pluralize"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildAdminRequirementCard = ({ requirement, ...rest }: Props): JSX.Element => (
  <RequirementCard image="/requirementLogos/guild.png" {...rest}>
    {`Be an admin of a guild${
      requirement.data.minAmount > 0
        ? ` with at least ${pluralize(requirement.data.minAmount, "member")}`
        : ""
    }`}
  </RequirementCard>
)

export default GuildAdminRequirementCard
