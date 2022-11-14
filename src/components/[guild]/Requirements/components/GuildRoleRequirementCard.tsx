import { Img, Link, Text } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import useGuild from "components/[guild]/hooks/useGuild"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const GuildRoleRequirementCard = ({ requirement, ...rest }: Props): JSX.Element => {
  const { name, roles, urlName, isLoading } = useGuild(requirement.data.guildId)
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
      {...rest}
    >
      <Text as="span">{"Have the "}</Text>
      <DataBlock isLoading={isLoading}>{role?.name ?? "unknown"}</DataBlock>
      <Text as="span">{" role in the "}</Text>
      <Link
        href={`https://guild.xyz/${urlName ?? requirement.data.guildId}`}
        isExternal={true}
        colorScheme="blue"
      >
        {name ?? `#${requirement.data.guildId}`}
      </Link>
      <Text as="span">{" guild"}</Text>
    </RequirementCard>
  )
}

export default GuildRoleRequirementCard
