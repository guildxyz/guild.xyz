import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

export type Memberships = Array<{
  guildId: number
  roleIds: number[]
  isAdmin: boolean
}>

const useMemberships = () => {
  const { account } = useWeb3React()

  const shouldFetch = !!account

  const { data } = useSWRImmutable<Memberships>(
    shouldFetch ? `/user/membership/${account}` : null
  )

  return data
}

export default useMemberships
