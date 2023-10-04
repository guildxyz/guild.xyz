import { Icon, Img } from "@chakra-ui/react"
import Link from "components/common/Link"
import { useSimpleGuild } from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { Detective } from "phosphor-react"
import pluralize from "utils/pluralize"

const HaveRole = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { id } = useSimpleGuild()
  const { name, urlName, isLoading } = useSimpleGuild(requirement.data.guildId)
  const {
    id: roleId,
    name: roleName,
    imageUrl: roleImageUrl,
  } = useRole(requirement.data.guildId, requirement.data.roleId)

  return (
    <Requirement
      image={
        !roleId ? (
          <Icon as={Detective} boxSize={6} />
        ) : (
          roleImageUrl &&
          (roleImageUrl.match("guildLogos") ? (
            <Img src={roleImageUrl} alt="Role image" boxSize="40%" />
          ) : (
            <Img
              src={roleImageUrl}
              alt="Role image"
              w="full"
              h="full"
              objectFit="cover"
            />
          ))
        )
      }
      isImageLoading={isLoading}
      {...props}
    >
      {!roleId ? (
        "The required guild role is invisible"
      ) : (
        <>
          {"Have the "}
          <Link
            href={`/${urlName ?? requirement.data.guildId}#role-${roleId}`}
            colorScheme="blue"
          >
            {`${roleName ?? "unknown"} role`}
            {id !== requirement.data.guildId &&
              ` in the ${name ?? `#${requirement.data.guildId}`} guild`}
          </Link>
        </>
      )}
    </Requirement>
  )
}

const UserSince = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement image="/requirementLogos/guild.png" {...props}>
      {"Be a Guild.xyz user since at least "}
      <DataBlockWithDate timestamp={requirement.data.creationDate} />
    </Requirement>
  )
}

const MinGuilds = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement image="/requirementLogos/guild.png" {...props}>
      {`Be a member of at least ${pluralize(requirement.data.minAmount, "guild")}`}
    </Requirement>
  )
}

const Admin = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement image="/requirementLogos/guild.png" {...props}>
      {`Be an admin of a guild${
        requirement.data.minAmount > 0
          ? ` with at least ${pluralize(requirement.data.minAmount, "member")}`
          : ""
      }`}
    </Requirement>
  )
}

const types = {
  GUILD_ROLE: HaveRole,
  GUILD_ADMIN: Admin,
  GUILD_MINGUILDS: MinGuilds,
  GUILD_USER_SINCE: UserSince,
}

const GuildRequirement = (props: RequirementProps) => {
  const { type } = useRequirementContext()
  const Component = types[type]
  return <Component {...props} />
}

export default GuildRequirement
