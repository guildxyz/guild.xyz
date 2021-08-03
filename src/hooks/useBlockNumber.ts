import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const getBlockNumber = (_: string, library: Web3Provider) => library.getBlockNumber()

const useBlockNumber = () => {
  const { library } = useWeb3React<Web3Provider>()
  const shouldFetch = !!library

  const { data } = useSWR<number>(
    shouldFetch ? ["BlockNumber", library] : null,
    getBlockNumber,
    {
      refreshInterval: 10 * 1000,
    }
  )

  return data
}

export default useBlockNumber
