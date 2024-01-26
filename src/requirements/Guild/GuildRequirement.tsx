import { Icon, Img, Skeleton, Text } from "@chakra-ui/react"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useSimpleGuild } from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import Link from "components/common/Link"
import { Detective } from "phosphor-react"
import useSWRImmutable from "swr/immutable"
import { Group } from "types"
import pluralize from "utils/pluralize"
import { useMemo } from "react"
import formatRelativeTimeFromNow from "../../utils/formatRelativeTimeFromNow"

type HaveRoleProps = RequirementProps & { isRelative?: boolean }

const HaveRole = ({ isRelative, ...props }: HaveRoleProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { id } = useSimpleGuild()
  const {
    name,
    urlName,
    isLoading: isGuildLoading,
  } = useSimpleGuild(requirement.data.guildId)
  const {
    id: roleId,
    name: roleName,
    imageUrl: roleImageUrl,
    groupId,
    isLoading: isRoleLoading,
  } = useRole(requirement.data.guildId, requirement.data.roleId)

  const { data: group, isLoading: isGroupLoading } = useSWRImmutable<Group>(
    groupId ? `/v2/guilds/${id}/groups/${groupId}` : null
  )
  const maxAmount = new Date(requirement.data.maxAmount)
  const filterLabel = useMemo(
    () =>
      isRelative
        ? ` for ${formatRelativeTimeFromNow(requirement.data.maxAmount)}`
        : requirement.data.maxAmount &&
          ` since ${maxAmount.toLocaleDateString("en-US", {
            ...(maxAmount.getFullYear() !== new Date().getFullYear() && {
              year: "numeric",
            }),
            month: "short",
            day: "numeric",
          })}`,
    [requirement.data.maxAmount, maxAmount]
  )

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
      isImageLoading={isRoleLoading}
      {...props}
    >
      {!roleId ? (
        "The required guild role is invisible"
      ) : (
        <>
          <Text as="span">{"Have the "}</Text>
          <Skeleton
            display="inline-block"
            isLoaded={!isGuildLoading && !isRoleLoading && !isGroupLoading}
          >
            <Link
              href={`/${urlName ?? requirement.data.guildId}${
                group ? `/${group.urlName}` : ""
              }#role-${roleId}`}
              colorScheme="blue"
            >
              {`${roleName ?? "unknown"} role`}
              {id !== requirement.data.guildId &&
                ` in the ${name ?? `#${requirement.data.guildId}`} guild`}
            </Link>
            {filterLabel}
          </Skeleton>
        </>
      )}
    </Requirement>
  )
}

const UserSince = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement image="/requirementLogos/guild.png" {...props}>
      <Text as="span">{"Be a Guild.xyz user since at least "}</Text>
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

const GuildMember = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const { name, urlName, imageUrl, isLoading } = useSimpleGuild(
    requirement.data.guildId
  )

  return (
    <Requirement image={imageUrl} isImageLoading={isLoading} {...props}>
      <Text as="span">{"Be a member of the "}</Text>
      <Skeleton display="inline-block" isLoaded={!isLoading}>
        <Link href={`/${urlName ?? requirement.data.guildId}`} colorScheme="blue">
          {` ${name ?? `#${requirement.data.guildId}`} guild`}
        </Link>
      </Skeleton>
    </Requirement>
  )
}

const HaveRoleRelative = (props: RequirementProps) => (
  <HaveRole {...props} isRelative />
)

const types = {
  GUILD_ROLE: HaveRole,
  GUILD_ROLE_RELATIVE: HaveRoleRelative,
  GUILD_ADMIN: Admin,
  GUILD_MINGUILDS: MinGuilds,
  GUILD_USER_SINCE: UserSince,
  GUILD_MEMBER: GuildMember,
}

const GuildRequirement = (props: RequirementProps) => {
  const { type } = useRequirementContext()
  const Component = types[type]
  return <Component {...props} />
}

export default GuildRequirement
