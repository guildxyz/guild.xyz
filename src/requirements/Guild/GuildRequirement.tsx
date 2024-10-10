import { Anchor } from "@/components/ui/Anchor"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { Skeleton } from "@/components/ui/Skeleton"
import { Detective } from "@phosphor-icons/react/dist/ssr"
import { DataBlockWithDate } from "components/[guild]/Requirements/components/DataBlockWithDate"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useSimpleGuild } from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import { ComponentType } from "react"
import { RequirementType } from "requirements/types"
import useSWRImmutable from "swr/immutable"
import { Group } from "types"
import pluralize from "utils/pluralize"
import formatRelativeTimeFromNow from "../../utils/formatRelativeTimeFromNow"

type GuildRequirementTypes = Exclude<
  Extract<RequirementType, `GUILD_${string}`>,
  "GUILD_SNAPSHOT"
>

const HaveRole = (props: RequirementProps): JSX.Element => {
  const requirement =
    useRequirementContext<Extract<RequirementType, `GUILD_ROLE${string}`>>()

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

  const minAmount = requirement.data.minAmount
    ? new Date(requirement.data.minAmount)
    : undefined
  const maxAmount = requirement.data.maxAmount
    ? new Date(requirement.data.maxAmount)
    : undefined

  const prettyMinAmount = minAmount
    ? minAmount.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined

  const prettyMaxAmount = maxAmount
    ? maxAmount.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined

  const filterLabel =
    requirement.type === "GUILD_ROLE_RELATIVE"
      ? ` for ${formatRelativeTimeFromNow(requirement.data.maxAmount)}`
      : minAmount && maxAmount
        ? ` between ${prettyMinAmount} and ${prettyMaxAmount}`
        : minAmount
          ? ` before ${prettyMinAmount}`
          : maxAmount
            ? ` since ${prettyMaxAmount}`
            : null

  return (
    <Requirement
      image={
        !roleId ? (
          <Detective weight="bold" className="size-6" />
        ) : (
          roleImageUrl && (
            <Avatar className="row-span-2 size-12">
              <AvatarImage
                src={roleImageUrl}
                alt={`${roleName} logo`}
                width={24}
                height={24}
              />
            </Avatar>
          )
        )
      }
      isImageLoading={isRoleLoading}
      {...props}
    >
      {!roleId ? (
        "The required guild role is invisible"
      ) : (
        <>
          <span>{"Have the "}</span>

          {isGuildLoading || isRoleLoading || isGroupLoading ? (
            <Skeleton className="inline-block h-5 w-40" />
          ) : (
            <>
              <Anchor
                href={`/${urlName ?? requirement.data.guildId}${
                  group ? `/${group.urlName}` : ""
                }#role-${roleId}`}
                variant="highlighted"
                showExternal={requirement.data.guildId !== id}
                target={requirement.data.guildId !== id ? "_blank" : undefined}
              >
                {`${roleName ?? "unknown"} role`}
                {id !== requirement.data.guildId &&
                  ` in the ${name ?? `#${requirement.data.guildId}`} guild`}
              </Anchor>
              <span>{filterLabel}</span>
            </>
          )}
        </>
      )}
    </Requirement>
  )
}

const UserSince = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<"GUILD_USER_SINCE">()

  return (
    <Requirement image="/requirementLogos/guild.png" {...props}>
      <span>{"Be a Guild.xyz user since at least "}</span>
      <DataBlockWithDate timestamp={requirement.data.creationDate.toString()} />
    </Requirement>
  )
}

const MinGuilds = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<"GUILD_MINGUILDS">()

  return (
    <Requirement image="/requirementLogos/guild.png" {...props}>
      {`Be a member of at least ${pluralize(requirement.data.minAmount, "guild")}`}
    </Requirement>
  )
}

const Admin = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<"GUILD_ADMIN">()

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
  const requirement = useRequirementContext<"GUILD_MEMBER">()
  const { id } = useSimpleGuild()
  const { name, urlName, imageUrl, isLoading } = useSimpleGuild(
    requirement.data.guildId
  )

  return (
    <Requirement image={imageUrl} isImageLoading={isLoading} {...props}>
      <span>{"Be a member of the "}</span>
      {isLoading ? (
        <Skeleton className="inline-block h-5 w-40" />
      ) : (
        <Anchor
          href={`/${urlName ?? requirement.data.guildId}`}
          variant="highlighted"
          showExternal={requirement.data.guildId !== id}
          target={requirement.data.guildId !== id ? "_blank" : undefined}
        >
          {` ${name ?? `#${requirement.data.guildId}`} guild`}
        </Anchor>
      )}
    </Requirement>
  )
}

const types = {
  GUILD_ROLE: HaveRole,
  GUILD_ROLE_RELATIVE: HaveRole,
  GUILD_ADMIN: Admin,
  GUILD_MINGUILDS: MinGuilds,
  GUILD_USER_SINCE: UserSince,
  GUILD_MEMBER: GuildMember,
} satisfies Record<GuildRequirementTypes, ComponentType<RequirementProps>>

const GuildRequirement = (props: RequirementProps) => {
  const { type } = useRequirementContext<GuildRequirementTypes>()
  const Component = types[type]
  return <Component {...props} />
}

export default GuildRequirement
