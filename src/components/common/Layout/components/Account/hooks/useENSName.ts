import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const fetchENSName = (_, library, address) => library.lookupAddress(address)

const useENSName = (address: string): string => {
  const { library, chainId } = useWeb3React<Web3Provider>()

  const shouldFetch = library && address

  const { data } = useSWR(
    shouldFetch ? ["ENS", library, address, chainId] : null,
    fetchENSName
  )

  return data
}

export default useENSName
