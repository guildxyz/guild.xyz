import { Center, Icon, Text, Wrap } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight } from "phosphor-react"
import platforms from "platforms/platforms"
import capitalize from "utils/capitalize"
import { useActivityLog } from "../../ActivityLogContext"
import { ACTION } from "../../constants"
import { useActivityLogActionContext } from "../ActivityLogActionContext"
import GuildTag from "./GuildTag"
import IdentityTag from "./IdentityTag"
import { ClickableRewardTag } from "./RewardTag"
import { ClickableRoleTag } from "./RoleTag"
import UserTag, { ClickableUserTag } from "./UserTag"

const ActionLabel = (): JSX.Element => {
  const { data: activityLog, isUserActivityLog } = useActivityLog()

  const { action, ids, data, parentId } = useActivityLogActionContext()

  const capitalizedName = capitalize(action)

  return (
    <Wrap
      spacingX={{ base: 1, md: 1.5 }}
      spacingY={{ base: 0.5, md: 1 }}
      fontWeight="semibold"
    >
      {(() => {
        switch (action) {
          case ACTION.CreateGuild:
          case ACTION.LeaveGuild:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {isUserActivityLog ? (
                  <GuildTag guildId={ids.guild} />
                ) : (
                  <>
                    <Text as="span">by</Text>
                    <UserTag userId={ids.user} />
                  </>
                )}
              </>
            )
          case ACTION.UpdateGuild:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {isUserActivityLog ? (
                  <GuildTag guildId={ids.guild} />
                ) : (
                  <>
                    <Text as="span"> by </Text>
                    <ClickableUserTag userId={ids.user} />
                  </>
                )}
              </>
            )
          case ACTION.DeleteGuild:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <GuildTag guildId={ids.guild} />
              </>
            )
          case ACTION.AddAdmin:
          case ACTION.RemoveAdmin:
            return (
              <>
                <Text as="span">{capitalizedName}:</Text>
                <ClickableUserTag userId={ids.user} />
                {isUserActivityLog && <GuildTag guildId={ids.guild} />}
              </>
            )
          case ACTION.CreateRole:
          case ACTION.UpdateRole:
          case ACTION.DeleteRole:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
                {isUserActivityLog ? (
                  <GuildTag guildId={ids.guild} />
                ) : (
                  <>
                    <Text as="span">by</Text>
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
                <Text as="span">{capitalizedName}</Text>
                <ClickableRewardTag
                  roleId={ids.role}
                  rolePlatformId={ids.rolePlatform}
                />
                <Text as="span">to role</Text>
                <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
              </>
            )
          case ACTION.SendReward:
          case ACTION.RevokeReward:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <ClickableRewardTag
                  roleId={ids.role}
                  rolePlatformId={ids.rolePlatform}
                />
              </>
            )
          case ACTION.LoseReward:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <ClickableRewardTag
                  roleId={ids.role}
                  rolePlatformId={ids.rolePlatform}
                />
                {!parentId && (
                  <>
                    <Center h={6}>
                      <Icon as={ArrowLeft} />
                    </Center>
                    <ClickableUserTag userId={ids.user} />
                  </>
                )}
              </>
            )
          case ACTION.GetReward:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <ClickableRewardTag
                  roleId={ids.role}
                  rolePlatformId={ids.rolePlatform}
                />
                {!parentId && (
                  <>
                    <Center h={6}>
                      <Icon as={ArrowRight} />
                    </Center>
                    <ClickableUserTag userId={ids.user} />
                  </>
                )}
              </>
            )
          case ACTION.ClickJoinOnWeb:
            return (
              <>
                <Text as="span">Join Guild through website</Text>
                {isUserActivityLog ? (
                  <GuildTag guildId={ids.guild} />
                ) : (
                  <ClickableUserTag userId={ids.user} />
                )}
              </>
            )
          case ACTION.ClickJoinOnPlatform:
            return (
              <>
                <Text as="span">{`Join Guild through ${
                  platforms[data.platformName].name
                }`}</Text>
                {isUserActivityLog ? (
                  <GuildTag guildId={ids.guild} />
                ) : (
                  <ClickableUserTag userId={ids.user} />
                )}
              </>
            )
          case ACTION.UserStatusUpdate:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {isUserActivityLog ? (
                  <GuildTag guildId={ids.guild} />
                ) : (
                  <UserTag userId={ids.user} />
                )}
              </>
            )
          case ACTION.GetRole:
          case ACTION.LoseRole:
            const parentaction = activityLog?.entries?.find(
              (log) => log.id === parentId
            )?.action
            const isChildOfUserStatusUpdate = [
              ACTION.UserStatusUpdate,
              ACTION.JoinGuild,
              ACTION.ClickJoinOnWeb,
              ACTION.ClickJoinOnPlatform,
              ACTION.LeaveGuild,
            ].includes(parentaction)

            return (
              <>
                <Text as="span">
                  {capitalizedName}
                  {isChildOfUserStatusUpdate ? ":" : ""}
                </Text>
                {isChildOfUserStatusUpdate ? (
                  <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
                ) : (
                  <ClickableUserTag userId={ids.user} />
                )}
              </>
            )
          case ACTION.AddRequirement:
          case ACTION.UpdateRequirement:
          case ACTION.RemoveRequirement:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {!parentId && (
                  <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
                )}
              </>
            )

          case ACTION.ConnectIdentity:
          case ACTION.DisconnectIdentity:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <IdentityTag
                  platformName={data.platformName}
                  username={data.username}
                />
                {!isUserActivityLog && <ClickableUserTag userId={ids.user} />}
              </>
            )

          default:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {ids.role ? (
                  <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
                ) : ids.user ? (
                  <ClickableUserTag userId={ids.user} />
                ) : null}
              </>
            )
        }
      })()}
    </Wrap>
  )
}

export default ActionLabel
