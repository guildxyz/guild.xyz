import { Center, Icon, Text, Wrap } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight } from "phosphor-react"
import rewards from "platforms/rewards"
import capitalize from "utils/capitalize"
import { useActivityLog } from "../../ActivityLogContext"
import { ACTION } from "../../constants"
import { useActivityLogActionContext } from "../ActivityLogActionContext"
import { ClickableRoleTag } from "./ActivityLogRoleTag"
import { ClickableFormTag } from "./FormTag"
import { ClickableGuildTag } from "./GuildTag"
import IdentityTag from "./IdentityTag"
import { ClickableRewardTag } from "./RewardTag"
import { ClickableUserTag } from "./UserTag"

const ActionLabel = (): JSX.Element => {
  const { data: activityLog, activityLogType } = useActivityLog()
  const showGuildTag = activityLogType === "user" || activityLogType === "all"

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
                {showGuildTag ? (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableGuildTag guildId={ids.guild} />
                ) : (
                  <>
                    <Text as="span">by</Text>
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <ClickableUserTag userId={ids.user} />
                  </>
                )}
              </>
            )
          case ACTION.UpdateGuild:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {showGuildTag ? (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableGuildTag guildId={ids.guild} />
                ) : (
                  <>
                    <Text as="span"> by </Text>
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <ClickableUserTag userId={ids.user} />
                  </>
                )}
              </>
            )
          case ACTION.DeleteGuild:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                <ClickableGuildTag guildId={ids.guild} />
              </>
            )
          case ACTION.AddAdmin:
          case ACTION.RemoveAdmin:
            return (
              <>
                <Text as="span">{capitalizedName}:</Text>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                <ClickableUserTag userId={ids.user} />
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {showGuildTag && <ClickableGuildTag guildId={ids.guild} />}
              </>
            )
          case ACTION.CreateRole:
          case ACTION.UpdateRole:
          case ACTION.DeleteRole:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
                {showGuildTag ? (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableGuildTag guildId={ids.guild} />
                ) : (
                  <>
                    <Text as="span">by</Text>
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
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
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  roleId={ids.role}
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  rolePlatformId={ids.rolePlatform}
                />
                <Text as="span">to role</Text>
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
              </>
            )
          case ACTION.SendReward:
          case ACTION.RevokeReward:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <ClickableRewardTag
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  roleId={ids.role}
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  rolePlatformId={ids.rolePlatform}
                />
              </>
            )
          case ACTION.LoseReward:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <ClickableRewardTag
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  roleId={ids.role}
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  rolePlatformId={ids.rolePlatform}
                />
                {!parentId && (
                  <>
                    <Center h={6}>
                      <Icon as={ArrowLeft} />
                    </Center>
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
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
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  roleId={ids.role}
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  rolePlatformId={ids.rolePlatform}
                />
                {!parentId && (
                  <>
                    <Center h={6}>
                      <Icon as={ArrowRight} />
                    </Center>
                    {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                    <ClickableUserTag userId={ids.user} />
                  </>
                )}
              </>
            )
          case ACTION.ClickJoinOnWeb:
            return (
              <>
                <Text as="span">Join Guild through website</Text>
                {showGuildTag ? (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableGuildTag guildId={ids.guild} />
                ) : (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableUserTag userId={ids.user} />
                )}
              </>
            )
          case ACTION.ClickJoinOnPlatform:
            return (
              <>
                <Text as="span">{`Join Guild through ${
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  rewards[data.platformName].name
                }`}</Text>
                {showGuildTag ? (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableGuildTag guildId={ids.guild} />
                ) : (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableUserTag userId={ids.user} />
                )}
              </>
            )
          case ACTION.UserStatusUpdate:
          case ACTION.OptOut:
          case ACTION.OptIn:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {showGuildTag ? (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableGuildTag guildId={ids.guild} />
                ) : (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableUserTag userId={ids.user} />
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
              // @ts-expect-error TODO: fix this error originating from strictNullChecks
            ].includes(parentaction)

            return (
              <>
                <Text as="span">
                  {capitalizedName}
                  {isChildOfUserStatusUpdate ? ":" : ""}
                </Text>
                {isChildOfUserStatusUpdate ? (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
                ) : (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableRoleTag roleId={ids.role} guildId={ids.guild} />
                )}
                {showGuildTag ? (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableGuildTag guildId={ids.guild} />
                ) : (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableUserTag userId={ids.user} />
                )}
              </>
            )
          case ACTION.CreateForm:
          case ACTION.UpdateForm:
          case ACTION.DeleteForm:
          case ACTION.SubmitForm:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {activityLogType !== "guild" && (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableGuildTag guildId={ids.guild} />
                )}

                <ClickableFormTag
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  formId={ids.form}
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  guildId={ids.guild}
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  userId={ids.user}
                />
                {activityLogType !== "user" && (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  <ClickableUserTag userId={ids.user} />
                )}
              </>
            )

          case ACTION.ConnectIdentity:
          case ACTION.DisconnectIdentity:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <IdentityTag
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  platformName={data.platformName}
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  username={data.username}
                />
                {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
                {activityLogType != "user" && <ClickableUserTag userId={ids.user} />}
              </>
            )

          default:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {ids.role ? (
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
