import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { User } from "types"

const getlinkedAddressesCount = (addresses: string[] | number) => {
  if (!addresses) return
  if (Array.isArray(addresses)) return addresses.length > 1 && addresses.length - 1
  return addresses > 1 && addresses - 1
}

type UserFetchProps = {
  method: "POST"
  body: unknown
  validationData: { address: string; library: Web3Provider }
  timestamp: number
}

const useUser = () => {
  const { account, library } = useWeb3React()

  const { data: fetchProps, mutate } = useSWR<UserFetchProps>(
    "fetchProps",
    () => ({
      method: "POST",
      body: {},
      validationData: { address: account, library },
      timestamp: Date.now(),
    }),
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  )

  const endpoint = fetchProps ? `/user/details/${account}` : `/user/${account}`

  const { isValidating, data } = useSWR<User>(
    account ? [endpoint, fetchProps] : null,
    null,
    fetchProps
      ? {
          refreshInterval: 0,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          revalidateIfStale: false,
        }
      : {}
  )

  return {
    isLoading: isValidating,
    ...data,
    linkedAddressesCount: getlinkedAddressesCount(data?.addresses),
    verifyAddress: () => mutate(),
  }
}

export default useUser
