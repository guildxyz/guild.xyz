import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import useGuild from "components/[guild]/hooks/useGuild"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildRoleRequirementCard = ({ requirement }: Props): JSX.Element => {
  const { name, roles } = useGuild(requirement.data.urlName)
  const role = roles?.find((r) => r.id === requirement.data.roleId)

  return (
    <RequirementCard
      image={
        role?.imageUrl &&
        (role.imageUrl?.match("guildLogos") ? (
          <Img src={role.imageUrl} alt="Guild logo" boxSize="40%" />
        ) : (
          role.imageUrl
        ))
      }
    >
      {"Have the "}
      <DataBlock>{role?.name ?? "unknown"}</DataBlock>
      {" role in the "}
      <DataBlock>{name ?? "unknown"}</DataBlock>
      {" guild"}
    </RequirementCard>
  )
}

export default GuildRoleRequirementCard
