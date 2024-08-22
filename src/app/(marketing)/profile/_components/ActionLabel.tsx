"use client"

// import { Center, Icon, Text, Wrap } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight, Rocket } from "@phosphor-icons/react"
import rewards from "rewards"
import capitalize from "utils/capitalize"
// import { useActivityLog } from "../../ActivityLogContext"
// import { useActivityLogActionContext } from "../ActivityLogActionContext"

// import { ClickableRoleTag } from "./ActivityLogRoleTag"
// import { ClickableFormTag } from "./FormTag"
// import { ClickableGuildTag } from "./GuildTag"
// import IdentityTag from "./IdentityTag"
// import { ClickableRewardTag } from "./RewardTag"
// import { ClickableUserTag } from "./UserTag"

import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import { useUserPublic } from "@/hooks/useUserPublic"
import { Guild, Role } from "@guildxyz/types"
import { ActivityLogType } from "components/[guild]/activity/ActivityLogContext"
import { ACTION, ActivityLogAction } from "components/[guild]/activity/constants"
import { FunctionComponent, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "../_hooks/useProfile"

const ClickableGuildTag: FunctionComponent<{ guildId?: number }> = ({ guildId }) => {
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

const ClickableUserTag: FunctionComponent<{ userId: number }> = ({ userId }) => {
  // TODO: remove this, as without `ActivityLogActionResponse` this component
  // doesn't make sense and in the context of profile there is no reason to
  // display user information
  return null
  return (
    <Badge className="whitespace-nowrap">
      <Rocket weight="fill" />
      {userId}
    </Badge>
  )
}

const ClickableRewardTag: FunctionComponent<{
  roleId: number
  rolePlatformId: number
}> = () => {
  return null
}

const ClickableRoleTag: FunctionComponent<{
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
  // const { data: activityLog, activityLogType } = useActivityLog()
  // const { action, ids, data, parentId } = useActivityLogActionContext()

  const { data: profile } = useProfile()
  const { id: userId } = useUserPublic()
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const isProfileOwner = useMemo(
    () => !!profile?.userId && userId === profile.userId,
    [userId]
  )

  const activityLogType: ActivityLogType = isProfileOwner
    ? "all"
    : !!userId
      ? "user"
      : "guild"

  // const { data: activityLog, activityLogType } = useActivityLog()
  const { action, ids, data, parentId } = activity
  const showGuildTag = false // activityLogType === "user" || activityLogType === "all"
  const capitalizedName = capitalize(action)

  return (() => {
    switch (action) {
      case ACTION.CreateGuild:
      case ACTION.LeaveGuild:
        return (
          <>
            <span>{capitalizedName}</span>
            {showGuildTag ? (
              <ClickableGuildTag guildId={ids.guild} />
            ) : (
              <>
                <span>by</span>
                <ClickableUserTag userId={ids.user} />
              </>
            )}
          </>
        )
      case ACTION.UpdateGuild:
        return (
          <>
            <span>{capitalizedName}</span>
            {showGuildTag ? (
              <ClickableGuildTag guildId={ids.guild} />
            ) : (
              <>
                <span> by </span>
                <ClickableUserTag userId={ids.user} />
              </>
            )}
          </>
        )
      case ACTION.DeleteGuild:
        return (
          <>
            <span>{capitalizedName}</span>
            <ClickableGuildTag guildId={ids.guild} />
          </>
        )
      case ACTION.AddAdmin:
      case ACTION.RemoveAdmin:
        return (
          <>
            <span>{capitalizedName}:</span>
            <ClickableUserTag userId={ids.user} />
            {showGuildTag && <ClickableGuildTag guildId={ids.guild} />}
          </>
        )
      case ACTION.CreateRole:
      case ACTION.UpdateRole:
      case ACTION.DeleteRole:
        return (
          <>
            <span>{capitalizedName}</span>
            <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
            {showGuildTag ? (
              <ClickableGuildTag guildId={ids.guild} />
            ) : (
              <>
                <span>by</span>
                <ClickableUserTag userId={ids.user} />
              </>
            )}
          </>
        )
      case ACTION.AddReward:
      case ACTION.RemoveReward:
      case ACTION.UpdateReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <ClickableRewardTag
              roleId={ids.role}
              rolePlatformId={ids.rolePlatform}
            />
            <span>to role</span>
            <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
          </>
        )
      case ACTION.SendReward:
      case ACTION.RevokeReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <ClickableRewardTag
              roleId={ids.role}
              rolePlatformId={ids.rolePlatform}
            />
          </>
        )
      case ACTION.LoseReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <ClickableRewardTag
              roleId={ids.role}
              rolePlatformId={ids.rolePlatform}
            />
            {!parentId && (
              <>
                <ArrowLeft />
                <ClickableUserTag userId={ids.user} />
              </>
            )}
          </>
        )
      case ACTION.GetReward:
        return (
          <>
            <span>{capitalizedName}</span>
            <ClickableRewardTag
              roleId={ids.role}
              rolePlatformId={ids.rolePlatform}
            />
            {!parentId && (
              <>
                <ArrowRight />
                <ClickableUserTag userId={ids.user} />
              </>
            )}
          </>
        )
      case ACTION.JoinGuild:
        return (
          <>
            <span>Join Guild</span>
            {showGuildTag && <ClickableGuildTag guildId={ids.guild} />}
            {activityLogType !== "user" && <ClickableUserTag userId={ids.user} />}
          </>
        )
      case ACTION.ClickJoinOnPlatform:
        return (
          <>
            <span>{`Join Guild through ${rewards[data.platformName].name}`}</span>
            {showGuildTag ? (
              <ClickableGuildTag guildId={ids.guild} />
            ) : (
              <ClickableUserTag userId={ids.user} />
            )}
          </>
        )
      case ACTION.UserStatusUpdate:
      case ACTION.OptOut:
      case ACTION.OptIn:
        return (
          <>
            <span>{capitalizedName}</span>
            {showGuildTag ? (
              <ClickableGuildTag guildId={ids.guild} />
            ) : (
              <ClickableUserTag userId={ids.user} />
            )}
          </>
        )
      case ACTION.GetRole:
      case ACTION.LoseRole:
        // const parentaction = activityLog?.entries?.find(
        //   (log) => log.id === parentId
        // )?.action
        // const isChildOfUserStatusUpdate = [
        //   ACTION.UserStatusUpdate,
        //   ACTION.JoinGuild,
        //   ACTION.ClickJoinOnPlatform,
        //   ACTION.LeaveGuild,
        // ].includes(parentaction)

        return (
          <>
            <span>{capitalizedName}:</span>
            <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
          </>
        )
      case ACTION.AddRequirement:
      case ACTION.UpdateRequirement:
      case ACTION.RemoveRequirement:
        return (
          <>
            <span>{capitalizedName}</span>
            {!parentId && <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />}
            {showGuildTag ? (
              <ClickableGuildTag guildId={ids.guild} />
            ) : (
              <ClickableUserTag userId={ids.user} />
            )}
          </>
        )

      // case ACTION.CreateForm:
      // case ACTION.UpdateForm:
      // case ACTION.DeleteForm:
      // case ACTION.SubmitForm:
      //   return (
      //     <>
      //       <span>{capitalizedName}</span>
      //       {activityLogType !== "guild" && (
      //         <ClickableGuildTag guildId={ids.guild} />
      //       )}
      //
      //       <ClickableFormTag
      //         formId={ids.form}
      //         guildId={ids.guild}
      //         userId={ids.user}
      //       />
      //       {activityLogType !== "user" && <ClickableUserTag userId={ids.user} />}
      //     </>
      //   )

      // case ACTION.ConnectIdentity:
      // case ACTION.DisconnectIdentity:
      //   return (
      //     <>
      //       <span>{capitalizedName}</span>
      //       <IdentityTag platformName={data.platformName} username={data.username} />
      //       {activityLogType != "user" && <ClickableUserTag userId={ids.user} />}
      //     </>
      //   )

      default:
        return (
          <>
            <span>{capitalizedName}</span>
            {ids.role ? (
              <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
            ) : ids.user ? (
              <ClickableUserTag userId={ids.user} />
            ) : null}
          </>
        )
    }
  })()
}
