import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const fetchENSName = (_, provider, address) => provider.lookupAddress(address)

const useENSName = (address: string): string => {
  const { provider, chainId, account } = useWeb3React<Web3Provider>()
  console.log(account, 11)
  const shouldFetch = provider && address

  const { data } = useSWR(
    shouldFetch ? ["ENS", provider, address, chainId] : null,
    fetchENSName
  )

  return data
}

export default useENSName
