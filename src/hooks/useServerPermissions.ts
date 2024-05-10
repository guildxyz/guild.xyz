import useSWRImmutable from "swr/immutable"

type PermissionEntry = {
  name:
    | "Administrator"
    | "Create Invite"
    | "Manage Roles"
    | "Manage Server"
    | "Send Messages"
    | "Embed Links"
    | "Add Reactions"
    | "Use External Emoji"
    | "Read Message History"
  value: true
}

type RoleOrderEntry = {
  roleName: string
  discordRoleId: string
  rolePosition: number
}

export type PermissionsResponse = {
  permissions: PermissionEntry[]
  roleOrders: RoleOrderEntry[]
}

export default function useServerPermissions(serverId: string) {
  const shouldFetch = serverId?.length > 0
  const { data, error, isLoading, isValidating, mutate } =
    useSWRImmutable<PermissionsResponse>(
      shouldFetch ? `/v2/discord/servers/${serverId}/permissions` : null,
      { shouldRetryOnError: false }
    )

  const permissions = data?.permissions ? Object.values(data.permissions) : undefined

  return {
    permissions,
    rolePrders: data?.roleOrders,
    error,
    isLoading,
    isValidating,
    mutate,
  }
}
