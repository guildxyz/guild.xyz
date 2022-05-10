import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

type Response = Array<{
  guildId: number
  roleIds: number[]
}>

const useMemberships = () => {
  const { account } = useWeb3React()

  const shouldFetch = !!account

  const { data } = useSWR<Response>(
    shouldFetch ? `/user/membership/${account}` : null,
    {
      refreshInterval: 10000,
    }
  )

  return data
}

export default useMemberships
