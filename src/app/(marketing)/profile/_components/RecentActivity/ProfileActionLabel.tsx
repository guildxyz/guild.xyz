"use client"

import { Badge } from "@/components/ui/Badge"
import { Guild, Role } from "@guildxyz/types"
import { Confetti, Rocket } from "@phosphor-icons/react"
import { ActivityLogActionResponse } from "components/[guild]/activity/ActivityLogContext"
import { ACTION, ActivityLogAction } from "components/[guild]/activity/constants"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { FunctionComponent } from "react"
import rewards from "rewards"
import useSWRImmutable from "swr/immutable"
import capitalize from "utils/capitalize"
import { useProfile } from "../../_hooks/useProfile"
import { BadgeSkeleton } from "./BadgeSkeleton"
import { RewardBadge } from "./RewardBadge"

const GuildBadge: FunctionComponent<{ guildId?: number }> = ({ guildId }) => {
  const { data: guildLatest, error } = useSWRImmutable<Guild>(
    guildId ? `/v2/guilds/${guildId}` : null,
    { shouldRetryOnError: false }
  )
  const profile = useProfile()
  const { data: guildFallback } = useSWRWithOptionalAuth<ActivityLogActionResponse>(
    guildId && error && profile.data
      ? `/v2/audit-log?guildId=${guildId}&limit=1&userId=${profile.data.userId}`
      : null
  )
  const guild = guildLatest
    ? { ...guildLatest, ...guildLatest?.theme }
    : guildFallback?.entries.at(0)?.data
  if (!guild) {
    return <BadgeSkeleton />
  }
  return <Badge className="whitespace-nowrap">{guild.name}</Badge>
}

const RoleBadge: FunctionComponent<{
  roleId?: number
  guildId?: number
}> = ({ roleId, guildId }) => {
  const { data: role, isLoading } = useSWRImmutable<Role>(
    roleId === undefined || guildId === undefined
      ? null
      : `/v2/guilds/${guildId}/roles/${roleId}`
  )

  if (isLoading) return <BadgeSkeleton />

  if (!role) {
    return <Badge variant="outline">Deleted role</Badge>
  }

  return (
    <Badge className="whitespace-nowrap">
      <Rocket weight="fill" />
      {role.name}
    </Badge>
  )
}

/** This component could just extend the original ActionLabel used in activity log, overriding actions
 * that we want to display differently, but we've decided to just copy & simplify it for now  */
export const ProfileActionLabel: FunctionComponent<{
  activity: ActivityLogAction
}> = ({ activity }) => {
  const { action, ids, data, parentId } = activity
  const capitalizedName = capitalize(action)

  return (() => {
    switch (action) {
      case ACTION.CreateGuild:
      case ACTION.LeaveGuild:
        return (
          <>
            <span>{capitalizedName}</span>
            {/* <GuildBadge guildId={ids.guild} /> */}
          </>
        )
      case ACTION.UpdateGuild:
        return (
          <>
            <span>{capitalizedName}</span>
            {/* <GuildBadge guildId={ids.guild} /> */}
          </>
        )
      case ACTION.DeleteGuild:
        return (
          <>
            <span>{capitalizedName}</span>
            {/* <GuildBadge guildId={ids.guild} /> */}
          </>
        )
      case ACTION.AddAdmin:
      case ACTION.RemoveAdmin:
        return (
          <>
            <span>{capitalizedName}:</span>
            {/* <GuildBadge guildId={ids.guild} /> */}
          </>
        )
      case ACTION.CreateRole:
      case ACTION.UpdateRole:
      case ACTION.DeleteRole:
        return (
          <>
            <span>{capitalizedName}</span>
            <RoleBadge roleId={ids.role} guildId={ids.guild} />
            {/* <GuildBadge guildId={ids.guild} /> */}
          </>
        )
      case ACTION.AddReward:
      case ACTION.RemoveReward:
      case ACTION.UpdateReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <RewardBadge
              guildId={ids.guild}
              roleId={ids.role}
              rolePlatformId={ids.rolePlatform}
            />
            <span>to role</span>
            <RoleBadge roleId={ids.role} guildId={ids.guild} />
          </>
        )
      case ACTION.SendReward:
      case ACTION.RevokeReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <RewardBadge
              guildId={ids.guild}
              roleId={ids.role}
              rolePlatformId={ids.rolePlatform}
            />
          </>
        )
      case ACTION.LoseReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <RewardBadge
              guildId={ids.guild}
              roleId={ids.role}
              rolePlatformId={ids.rolePlatform}
            />
          </>
        )
      case ACTION.GetReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <RewardBadge
              guildId={ids.guild}
              roleId={ids.role}
              rolePlatformId={ids.rolePlatform}
            />
          </>
        )
      case ACTION.JoinGuild:
        return (
          <>
            <span>Join Guild</span>
            {/* <GuildBadge guildId={ids.guild} /> */}
          </>
        )
      case ACTION.ClickJoinOnPlatform:
        return (
          <>
            <span>{`Join Guild through ${rewards[data.platformName].name}`}</span>
            {/* <GuildBadge guildId={ids.guild} /> */}
          </>
        )
      case ACTION.UserStatusUpdate:
      case ACTION.OptOut:
      case ACTION.OptIn:
        return (
          <>
            <span>{capitalizedName}</span>
            {/* <GuildBadge guildId={ids.guild} /> */}
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
            {/* <GuildBadge guildId={ids.guild} /> */}
          </>
        )
      // @ts-ignore TODO: add and move this to backend
      case "create profile":
        return (
          <>
            <span>{capitalizedName}</span>
            <Badge>
              <Confetti weight="fill" />@{data?.username}
            </Badge>
          </>
        )
      // @ts-ignore TODO: add and move this to backend
      case "refer profile":
        return (
          <>
            <span>{capitalizedName}</span>
            <Badge>@{data?.username}</Badge>
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
