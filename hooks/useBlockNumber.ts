import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const getBlockNumber = (library: Web3Provider) => async () =>
  library.getBlockNumber()

const useBlockNumber = () => {
  const { library } = useWeb3React<Web3Provider>()
  const shouldFetch = !!library

  return useSWR(shouldFetch ? ["BlockNumber"] : null, getBlockNumber(library), {
    refreshInterval: 10 * 1000,
  })
}

export default useBlockNumber
