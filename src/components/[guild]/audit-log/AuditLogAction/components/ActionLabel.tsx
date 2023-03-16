import { HStack, Text } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { PlatformName } from "types"
import capitalize from "utils/capitalize"
import { AUDITLOG } from "../../constants"
import useAuditLog from "../../hooks/useAuditLog"
import RoleTag from "../../RoleTag"
import UserTag from "../../UserTag"
import { useAuditLogActionContext } from "../AuditLogActionContext"

const platformTagColorSchemes: Record<PlatformName, string> = {
  DISCORD: "DISCORD",
  TELEGRAM: "TELEGRAM",
  TWITTER: "TWITTER",
  POAP: "POAP",
  GITHUB: "GITHUB",
  GOOGLE: "blue",
}

const ActionLabel = (): JSX.Element => {
  const { data: auditLog } = useAuditLog()

  const { actionName, values, ids, data, parentId } = useAuditLogActionContext()

  const capitalizedName = capitalize(actionName)

  return (
    <HStack>
      {(() => {
        switch (actionName) {
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
                <RoleTag data={data} />
                <Text as="span">by</Text>
                <UserTag address={values.user} />
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
                {/* TODO: we'll only see reward id, which is not enough info for us - Devid will add platformId and platformGuildName so we can show that data here */}
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
            const parentActionName = auditLog
              ?.flat()
              ?.find((log) => log.id === parentId)?.actionName
            const isChildOfUserStatusUpdate = [
              AUDITLOG.UserStatusUpdate,
              AUDITLOG.JoinGuild,
              AUDITLOG.ClickJoinOnWeb,
              AUDITLOG.ClickJoinOnPlatform,
              AUDITLOG.LeaveGuild,
            ].includes(parentActionName)

            return (
              <>
                <Text as="span">
                  {capitalizedName}
                  {isChildOfUserStatusUpdate ? ":" : ""}
                </Text>
                {isChildOfUserStatusUpdate ? (
                  <RoleTag roleId={ids.roleId} />
                ) : (
                  <UserTag address={values.user} />
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
                {ids.roleId ? (
                  <RoleTag data={data} roleId={ids.roleId} />
                ) : values.user ? (
                  <UserTag address={values.user} />
                ) : null}
              </>
            )
        }
      })()}
    </HStack>
  )
}

export default ActionLabel
