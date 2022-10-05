import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

export type Memberships = Array<{
  guildId: number
  roleIds: number[]
}>

const useMemberships = () => {
  const { account } = useWeb3React()

  const shouldFetch = !!account

  const { data } = useSWR<Memberships>(
    shouldFetch ? `/user/membership/${account}` : null
  )

  return data
}

export default useMemberships
