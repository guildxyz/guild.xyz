import { REQUIRED_PERMISSIONS } from "components/[guild]/DiscordBotPermissionsChecker"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type PermissionEntry = {
  name:
    | "Administrator"
    | "Read Message History"
    | (typeof REQUIRED_PERMISSIONS)[number]
  value: true
}

type RoleOrderEntry = {
  roleName: string
  discordRoleId: string
  rolePosition: number
}

const GUILD_BOT_ROLE_NAME = "Guild.xyz bot"

export type PermissionsResponse = {
  permissions: PermissionEntry[]
  roleOrders: RoleOrderEntry[]
}

function mapPermissions(permissions: PermissionsResponse) {
  const permissionsArray = Object.values(permissions.permissions)

  // Only checking that it is not on the bottom
  const isRoleOrderOk =
    // TODO: Checking by roleName feels sketchy, maybe we could return a flag for each entry, which indicates the relevant role
    permissions.roleOrders.find(({ roleName }) => roleName === GUILD_BOT_ROLE_NAME)
      .rolePosition !== 1

  return {
    ...permissions,
    permissions: permissionsArray,
    isRoleOrderOk,
    hasAllPermissions: permissionsArray.every(
      ({ name, value }) =>
        name === "Administrator" || name === "Read Message History" || !!value
    ),
  }
}

export default function useServerPermissions(serverId: string) {
  const shouldFetch = serverId?.length > 0
  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable<
    ReturnType<typeof mapPermissions>
  >(
    shouldFetch ? `/v2/discord/servers/${serverId}/permissions` : null,
    (url) => fetcher(url).then(mapPermissions),
    { shouldRetryOnError: false, revalidateOnMount: false }
  )

  return {
    permissions: data,
    rolePrders: data?.roleOrders,
    error,
    isLoading,
    isValidating,
    mutate,
  }
}
