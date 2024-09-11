import { REQUIRED_PERMISSIONS } from "components/[guild]/DiscordBotPermissionsChecker"
import { SWRConfiguration } from "swr"
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

  /**
   * If there are only 2 roles (everyone and Guild.xyz Bot), then we can accept the default role order
   * Otherwise, we check if there's at least one role below the Guild.xyz Bot role
   */
  const isRoleOrderOk =
    // TODO: Checking by roleName feels sketchy, maybe we could return a flag for each entry, which indicates the relevant role
    permissions.roleOrders.length === 2 ||
    permissions.roleOrders.find(({ roleName }) => roleName === GUILD_BOT_ROLE_NAME)
      ?.rolePosition !== 1

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

export default function useServerPermissions(
  serverId: string,
  config: SWRConfiguration & { shouldFetch?: boolean } = { shouldFetch: undefined }
) {
  const { shouldFetch, ...swrConfig } = config
  const shouldFetchFinal =
    (typeof shouldFetch === "undefined" || shouldFetch) && serverId?.length > 0
  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable<
    ReturnType<typeof mapPermissions>
  >(
    shouldFetchFinal ? `/v2/discord/servers/${serverId}/permissions` : null,
    (url) => fetcher(url).then(mapPermissions),
    { shouldRetryOnError: false, revalidateOnMount: false, ...swrConfig }
  )

  return {
    permissions: data,
    roleOrders: data?.roleOrders,
    error,
    isLoading,
    isValidating,
    mutate,
  }
}
