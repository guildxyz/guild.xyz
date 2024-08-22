"use client"

import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import { Guild, Role } from "@guildxyz/types"
import { Rocket } from "@phosphor-icons/react"
import { ACTION, ActivityLogAction } from "components/[guild]/activity/constants"
import { FunctionComponent } from "react"
import rewards from "rewards"
import useSWRImmutable from "swr/immutable"
import capitalize from "utils/capitalize"

const GuildBadge: FunctionComponent<{ guildId?: number }> = ({ guildId }) => {
  const { data: guild } = useSWRImmutable<Guild>(
    guildId === undefined ? null : `/v2/guilds/${guildId}`
  )
  if (!guild) {
    return <Skeleton className="inline-block h-5 w-16 translate-y-1/4" />
  }
  return (
    <Badge className="whitespace-nowrap">
      <Rocket weight="fill" />
      {guild.name}
    </Badge>
  )
}

const RewardBadge: FunctionComponent<{
  roleId: number
  rolePlatformId: number
}> = () => {
  // TODO: fill these using activity log response `values` field
  return null
}

const RoleBadge: FunctionComponent<{
  roleId?: number
  guildId?: number
}> = ({ roleId, guildId }) => {
  const { data: role } = useSWRImmutable<Role>(
    roleId === undefined || guildId === undefined
      ? null
      : `/v2/guilds/${guildId}/roles/${roleId}`
  )
  if (!role) {
    return <Skeleton className="inline-block h-5 w-16 translate-y-1/4" />
  }
  return (
    <Badge className="whitespace-nowrap">
      <Rocket weight="fill" />
      {role.name}
    </Badge>
  )
}

export const ActionLabel: FunctionComponent<{ activity: ActivityLogAction }> = ({
  activity,
}) => {
  const { action, ids, data, parentId } = activity
  const capitalizedName = capitalize(action)

  return (() => {
    switch (action) {
      case ACTION.CreateGuild:
      case ACTION.LeaveGuild:
        return (
          <>
            <span>{capitalizedName}</span>
            <GuildBadge guildId={ids.guild} />
          </>
        )
      case ACTION.UpdateGuild:
        return (
          <>
            <span>{capitalizedName}</span>
            <GuildBadge guildId={ids.guild} />
          </>
        )
      case ACTION.DeleteGuild:
        return (
          <>
            <span>{capitalizedName}</span>
            <GuildBadge guildId={ids.guild} />
          </>
        )
      case ACTION.AddAdmin:
      case ACTION.RemoveAdmin:
        return (
          <>
            <span>{capitalizedName}:</span>
            <GuildBadge guildId={ids.guild} />
          </>
        )
      case ACTION.CreateRole:
      case ACTION.UpdateRole:
      case ACTION.DeleteRole:
        return (
          <>
            <span>{capitalizedName}</span>
            <RoleBadge roleId={ids.role} guildId={ids.guild} />
            <GuildBadge guildId={ids.guild} />
          </>
        )
      case ACTION.AddReward:
      case ACTION.RemoveReward:
      case ACTION.UpdateReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <RewardBadge roleId={ids.role} rolePlatformId={ids.rolePlatform} />
            <span>to role</span>
            <RoleBadge roleId={ids.role} guildId={ids.guild} />
          </>
        )
      case ACTION.SendReward:
      case ACTION.RevokeReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <RewardBadge roleId={ids.role} rolePlatformId={ids.rolePlatform} />
          </>
        )
      case ACTION.LoseReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <RewardBadge roleId={ids.role} rolePlatformId={ids.rolePlatform} />
          </>
        )
      case ACTION.GetReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <RewardBadge roleId={ids.role} rolePlatformId={ids.rolePlatform} />
          </>
        )
      case ACTION.JoinGuild:
        return (
          <>
            <span>Join Guild</span>
            <GuildBadge guildId={ids.guild} />
          </>
        )
      case ACTION.ClickJoinOnPlatform:
        return (
          <>
            <span>{`Join Guild through ${rewards[data.platformName].name}`}</span>
            <GuildBadge guildId={ids.guild} />
          </>
        )
      case ACTION.UserStatusUpdate:
      case ACTION.OptOut:
      case ACTION.OptIn:
        return (
          <>
            <span>{capitalizedName}</span>
            <GuildBadge guildId={ids.guild} />
          </>
        )
      case ACTION.GetRole:
      case ACTION.LoseRole:
        return (
          <>
            <span>{capitalizedName}:</span>
            <RoleBadge roleId={ids.role} guildId={ids.guild} />
          </>
        )
      case ACTION.AddRequirement:
      case ACTION.UpdateRequirement:
      case ACTION.RemoveRequirement:
        return (
          <>
            <span>{capitalizedName}</span>
            {!parentId && <RoleBadge roleId={ids.role} guildId={ids.guild} />}
            <GuildBadge guildId={ids.guild} />
          </>
        )
      default:
        return (
          <>
            <span>{capitalizedName}</span>
            {ids.role ? <RoleBadge roleId={ids.role} guildId={ids.guild} /> : null}
          </>
        )
    }
  })()
}
