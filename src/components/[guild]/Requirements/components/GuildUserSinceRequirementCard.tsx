import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildUserSinceRequirementCard = ({ requirement }: Props): JSX.Element => (
  <RequirementCard image="/requirementLogos/guild.png">
    {`Be a Guild.xyz user at least since ${
      requirement.data.creationDate?.split("T")[0]
    }`}
  </RequirementCard>
)

export default GuildUserSinceRequirementCard
