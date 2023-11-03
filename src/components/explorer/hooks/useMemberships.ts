import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useAccount } from "wagmi"

export type Memberships = Array<{
  guildId: number
  roleIds: number[]
  isAdmin: boolean
  joinedAt: string
}>

const useMemberships = () => {
  const { address, isConnected } = useAccount()

  const { data, mutate, ...rest } = useSWRWithOptionalAuth<Memberships>(
    isConnected ? `/v2/users/${address}/memberships` : null
  )

  return {
    memberships: data,
    mutate,
    ...rest,
  }
}

export default useMemberships
