import { HStack, Text } from "@chakra-ui/react"
import { PlatformName } from "types"
import capitalize from "utils/capitalize"
import { AUDITLOG, AuditLogAction } from "../../constants"
import RoleTag from "../../RoleTag"
import UserTag from "../../UserTag"

type Props = {
  action: AuditLogAction
}

const platformTagColorSchemes: Record<PlatformName, string> = {
  DISCORD: "DISCORD",
  TELEGRAM: "TELEGRAM",
  TWITTER: "TWITTER",
  POAP: "POAP",
  GITHUB: "GITHUB",
  GOOGLE: "blue",
}

const ActionLabel = ({
  action: { actionName, values, ids, data },
}: Props): JSX.Element => {
  const capitalizedName = capitalize(actionName)

  if (
    [AUDITLOG.CreateRole, AUDITLOG.UpdateRole, AUDITLOG.DeleteRole].includes(
      actionName
    )
  )
    return (
      <HStack>
        <Text as="span">{capitalizedName}</Text>
        <RoleTag data={data} />
        <Text as="span">by</Text>
        <UserTag address={values.user} />
      </HStack>
    )

  // if ([AUDITLOG.SendReward, AUDITLOG.RevokeReward].includes(actionName)) return (
  //   <HStack>
  //     <Text as="span">{capitalizedName}</Text>
  //     <RewardTag />
  //   </HStack>
  // )

  const tagElement = ids.roleId ? (
    <RoleTag data={data} roleId={ids.roleId} />
  ) : values.user ? (
    <UserTag address={values.user} />
  ) : null

  return (
    <HStack>
      <Text as="span" fontWeight="semibold">
        {capitalize(actionName)}
      </Text>
      {tagElement}
    </HStack>
  )
}

export default ActionLabel
