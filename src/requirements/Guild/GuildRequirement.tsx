import { Img } from "@chakra-ui/react"
import Link from "components/common/Link"
import useGuild from "components/[guild]/hooks/useGuild"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import pluralize from "utils/pluralize"

const HaveRole = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { id } = useGuild()
  const { name, roles, urlName, isLoading } = useGuild(requirement.data.guildId)
  const role = roles?.find((r) => r.id === requirement.data.roleId)

  return (
    <Requirement
      image={
        role?.imageUrl &&
        (role.imageUrl?.match("guildLogos") ? (
          <Img src={role.imageUrl} alt="Guild logo" boxSize="40%" />
        ) : (
          role.imageUrl
        ))
      }
      isImageLoading={isLoading}
      {...props}
    >
      {"Have the "}
      <Link
        href={`/${urlName ?? requirement.data.guildId}#role-${role?.id}`}
        colorScheme="blue"
      >
        {`${role?.name ?? "unknown"} role`}
        {id !== requirement.data.guildId &&
          ` in the ${name ?? `#${requirement.data.guildId}`} guild`}
      </Link>
    </Requirement>
  )
}

const UserSince = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const formattedDate = new Date(requirement.data.creationDate).toLocaleDateString()

  return (
    <Requirement image="/requirementLogos/guild.png" {...props}>
      {"Be a Guild.xyz user since at least "}
      <DataBlock>{formattedDate}</DataBlock>
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
