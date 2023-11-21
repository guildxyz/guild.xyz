import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"

export type Memberships = Array<{
  guildId: number
  roleIds: number[]
  isAdmin: boolean
  joinedAt: string
}>

const useMemberships = () => {
  const { address, isWeb3Connected } = useWeb3ConnectionManager()

  const { data, mutate, ...rest } = useSWRWithOptionalAuth<Memberships>(
    isWeb3Connected ? `/v2/users/${address}/memberships` : null
  )

  return {
    memberships: data,
    mutate,
    ...rest,
  }
}

export default useMemberships
