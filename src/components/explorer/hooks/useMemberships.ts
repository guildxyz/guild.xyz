import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useAccount } from "wagmi"

export type Memberships = Array<{
  guildId: number
  roleIds: number[]
  isAdmin: boolean
  joinedAt: string
}>

const useMemberships = () => {
  const { address } = useAccount()

  const shouldFetch = !!address

  const { data, mutate, ...rest } = useSWRWithOptionalAuth<Memberships>(
    shouldFetch ? `/v2/users/${address}/memberships` : null
  )

  return {
    memberships: data,
    mutate,
    ...rest,
  }
}

export default useMemberships
