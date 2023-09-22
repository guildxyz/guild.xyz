import { useWeb3React } from "@web3-react/core"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"

export type Memberships = Array<{
  guildId: number
  roleIds: number[]
  isAdmin: boolean
  joinedAt: string
}>

const useMemberships = () => {
  const { account } = useWeb3React()

  const shouldFetch = !!account

  const { data, mutate, ...rest } = useSWRWithOptionalAuth<Memberships>(
    shouldFetch ? `/v2/users/${account}/memberships` : null
  )

  return {
    memberships: data,
    mutate,
    ...rest,
  }
}

export default useMemberships
