import useGuild from "components/[guild]/hooks/useGuild"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"

export type Memberships = Array<{
  guildId: number
  // roleIds is still returned for backwards compatibility, but we don't use it on the FE
  // roleIds: number[]
  isAdmin: boolean
  joinedAt: string

  roles: Array<{
    roleId: number
    access: boolean
    requirements: Array<{
      requirementId: number
      access: boolean | null
      amount?: number
      errorMsg?: string
      errorType?: string
      subType?: string
      lastCheckedAt: Date
    }>
  }>
}>

const useMembership = () => {
  const { id } = useGuild()

  const { address, isWeb3Connected } = useWeb3ConnectionManager()

  const { data: membership, ...rest } = useSWRWithOptionalAuth<Memberships[number]>(
    isWeb3Connected ? `/v2/users/${address}/memberships?guildId=${id}` : null
  )

  const isMember = !!membership?.roles?.some((role) => role.access)

  const roleIds = membership?.roles
    ?.filter((role) => role?.access)
    ?.map((role) => role.roleId)

  return { ...rest, membership, isMember, roleIds }
}

const useRoleMembership = (roleId: number) => {
  const guildMemberships = useMembership()

  const roleMembership = guildMemberships?.membership?.roles?.find(
    (role) => role?.roleId === roleId
  )

  const hasRoleAccess = !!roleMembership?.access

  return {
    ...guildMemberships,
    reqAccesses: roleMembership?.requirements,
    hasRoleAccess,
  }
}

export { useRoleMembership }
export default useMembership
