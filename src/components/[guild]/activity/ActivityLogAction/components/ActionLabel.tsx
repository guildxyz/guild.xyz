import { Center, Icon, Text, Wrap } from "@chakra-ui/react"
import { ArrowRight } from "phosphor-react"
import platforms from "platforms/platforms"
import capitalize from "utils/capitalize"
import { useActivityLog } from "../../ActivityLogContext"
import { ACTION } from "../../constants"
import { useActivityLogActionContext } from "../ActivityLogActionContext"
import IdentityTag from "./IdentityTag"
import { ClickableRewardTag } from "./RewardTag"
import { ClickableRoleTag } from "./RoleTag"
import { ClickableUserTag } from "./UserTag"

const ActionLabel = (): JSX.Element => {
  const { data: activityLog } = useActivityLog()

  const { action, ids, data, parentId } = useActivityLogActionContext()

  const capitalizedName = capitalize(action)

  return (
    <Wrap
      spacingX={{ base: 1, md: 1.5 }}
      spacingY={{ base: 0.5, md: 1.5 }}
      fontWeight="semibold"
    >
      {(() => {
        switch (action) {
          case ACTION.UpdateGuild:
            return (
              <>
                <Text as="span">{capitalizedName} by </Text>
                <ClickableUserTag id={ids.user} />
              </>
            )
          case ACTION.AddAdmin:
          case ACTION.RemoveAdmin:
            return (
              <>
                <Text as="span">{capitalizedName}:</Text>
                {/* <ClickableUserTag /> TODO */}
              </>
            )
          case ACTION.CreateRole:
          case ACTION.UpdateRole:
          case ACTION.DeleteRole:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <ClickableRoleTag id={ids.role} guildId={ids.guild} />
                <Text as="span">by</Text>
                <ClickableUserTag id={ids.user} />
              </>
            )
          case ACTION.AddReward:
          case ACTION.RemoveReward:
          case ACTION.UpdateReward:
          case ACTION.SendReward:
          case ACTION.RevokeReward:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <ClickableRewardTag rolePlatformId={ids.rolePlatform} />
              </>
            )
          case ACTION.LoseReward:
          case ACTION.GetReward:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <ClickableRewardTag rolePlatformId={ids.rolePlatform} />
                <Center h={6}>
                  <Icon as={ArrowRight} />
                </Center>
                <ClickableUserTag id={ids.user} />
              </>
            )
          case ACTION.ClickJoinOnWeb:
            return (
              <>
                <Text as="span">Join Guild through website</Text>
                <ClickableUserTag id={ids.user} />
              </>
            )
          case ACTION.ClickJoinOnPlatform:
            return (
              <>
                <Text as="span">{`Join Guild through ${
                  platforms[data.platformName].name
                }`}</Text>
                <ClickableUserTag id={ids.user} />
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
                  <ClickableRoleTag id={ids.role} guildId={ids.guild} />
                ) : (
                  <ClickableUserTag id={ids.user} />
                )}
              </>
            )
          case ACTION.AddRequirement:
          case ACTION.UpdateRequirement:
          case ACTION.RemoveRequirement:
            return <Text as="span">{capitalizedName}</Text>

          case ACTION.ConnectIdentity:
          case ACTION.DisconnectIdentity:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <IdentityTag
                  platformName={data.platformName}
                  username={data.username}
                />
                <ClickableUserTag id={ids.user} />
              </>
            )

          default:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                {ids.role ? (
                  <ClickableRoleTag id={ids.role} guildId={ids.guild} />
                ) : ids.user ? (
                  <ClickableUserTag id={ids.user} />
                ) : null}
              </>
            )
        }
      })()}
    </Wrap>
  )
}

export default ActionLabel
