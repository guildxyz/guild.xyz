import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useServerPermissions from "hooks/useServerPermissions"
import { ReactNode } from "react"
import { CardWarningComponentBase } from "rewards/components/CardWarningComponentBase"

const DiscordCardWarning = (): ReactNode => {
  const { isAdmin } = useGuildPermission()
  if (!isAdmin) return null

  return <DiscordCardWarningWithLogic />
}

const DiscordCardWarningWithLogic = (): ReactNode => {
  const rolePlatform = useRolePlatform()
  const { roleOrders } = useServerPermissions(
    // biome-ignore lint/style/noNonNullAssertion: we can be confident that platformGuildId exists at this point
    rolePlatform.guildPlatform?.platformGuildId!,
    {
      revalidateOnMount: true,
    }
  )

  const existingDiscordRoles = roleOrders?.map((role) => role.discordRoleId)

  if (
    !existingDiscordRoles ||
    !rolePlatform.platformRoleId ||
    existingDiscordRoles.includes(rolePlatform.platformRoleId)
  )
    return null

  return (
    <CardWarningComponentBase>
      This reward won't be assigned to users, because the connected Discord role
      doesn't exist anymore
    </CardWarningComponentBase>
  )
}

export { DiscordCardWarning }
