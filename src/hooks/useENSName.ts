import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr"

const fetchENSName = (_, provider, address) => provider.lookupAddress(address)

const useENSName = (address: string): string => {
  const { provider, chainId } = useWeb3React<Web3Provider>()
  const shouldFetch = Boolean(provider && address)

  const { data } = useSWRImmutable(
    shouldFetch ? ["ENS", provider, address, chainId] : null,
    fetchENSName
  )

  return data
}

export default useENSName
