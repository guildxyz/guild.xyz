import { HStack, Text } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import capitalize from "utils/capitalize"
import { AUDITLOG } from "../../constants"
import useAuditLog from "../../hooks/useAuditLog"
import { useAuditLogActionContext } from "../AuditLogActionContext"
import RewardTag from "./RewardTag"
import RoleTag from "./RoleTag"
import UserTag from "./UserTag"

const ActionLabel = (): JSX.Element => {
  const { data: auditLog } = useAuditLog()

  const { action, ids, data, parentId } = useAuditLogActionContext()

  const capitalizedName = capitalize(action)

  return (
    <HStack>
      {(() => {
        switch (action) {
          case AUDITLOG.AddAdmin:
          case AUDITLOG.RemoveAdmin:
            return (
              <>
                <Text as="span">{capitalizedName}:</Text>
                {/* <UserTag /> TODO */}
              </>
            )
          case AUDITLOG.CreateRole:
          case AUDITLOG.UpdateRole:
          case AUDITLOG.DeleteRole:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <RoleTag id={ids.role} data={data} />
                <Text as="span">by</Text>
                <UserTag id={ids.user} />
              </>
            )
          case AUDITLOG.AddReward:
          case AUDITLOG.RemoveReward:
          case AUDITLOG.UpdateReward:
          case AUDITLOG.SendReward:
          case AUDITLOG.RevokeReward:
          case AUDITLOG.LoseReward:
            return (
              <>
                <Text as="span">{capitalizedName}</Text>
                <RewardTag rolePlatformId={ids.rolePlatform} />
              </>
            )
          case AUDITLOG.ClickJoinOnWeb:
            return <Text as="span">Join Guild through website</Text>
          case AUDITLOG.ClickJoinOnPlatform:
            return (
              <Text as="span">{`Join Guild through ${
                platforms[data.platformName].name
              }`}</Text>
            )
          case AUDITLOG.GetRole:
          case AUDITLOG.LoseRole:
            const parentaction = auditLog?.entries?.find(
              (log) => log.id === parentId
            )?.action
            const isChildOfUserStatusUpdate = [
              AUDITLOG.UserStatusUpdate,
              AUDITLOG.JoinGuild,
              AUDITLOG.ClickJoinOnWeb,
              AUDITLOG.ClickJoinOnPlatform,
              AUDITLOG.LeaveGuild,
            ].includes(parentaction)

            return (
              <>
                <Text as="span">
                  {capitalizedName}
                  {isChildOfUserStatusUpdate ? ":" : ""}
                </Text>
                {isChildOfUserStatusUpdate ? (
                  <RoleTag id={ids.role} />
                ) : (
                  <UserTag id={ids.user} />
                )}
              </>
            )
          case AUDITLOG.AddRequirement:
          case AUDITLOG.UpdateRequirement:
          case AUDITLOG.RemoveRequirement:
            return (
              <Text as="span" fontWeight="semibold">
                {capitalizedName}
              </Text>
            )

          // TODO:
          //   ConnectIdentity,
          //   DisconnectIdentity

          default:
            return (
              <>
                <Text as="span" fontWeight="semibold">
                  {capitalizedName}
                </Text>
                {ids.role ? (
                  <RoleTag id={ids.role} data={data} />
                ) : ids.user ? (
                  <UserTag id={ids.user} />
                ) : null}
              </>
            )
        }
      })()}
    </HStack>
  )
}

export default ActionLabel
