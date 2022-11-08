import { Img, Skeleton, Text } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import useGuild from "components/[guild]/hooks/useGuild"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildRoleRequirementCard = ({ requirement }: Props): JSX.Element => {
  const { name, roles, isLoading } = useGuild(requirement.data.urlName)
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
      <Text as="span">{"Have the "}</Text>
      <Skeleton as="span" isLoaded={!isLoading}>
        {isLoading ? "Loading..." : <DataBlock>{role?.name ?? "unknown"}</DataBlock>}
      </Skeleton>
      <Text as="span">{" role in the "}</Text>
      <Skeleton as="span" isLoaded={!isLoading}>
        {isLoading ? "Loading..." : <DataBlock>{name ?? "unknown"}</DataBlock>}
      </Skeleton>
      <Text as="span">{" guild"}</Text>
    </RequirementCard>
  )
}

export default GuildRoleRequirementCard
