import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import parseBalance from "utils/parseBalance"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"

const getETHBalance =
  (library: Web3Provider) => async (_: string, address: string) =>
    library.getBalance(address).then((balance) => parseBalance(balance))

const useETHBalance = (address: string) => {
  const { library, chainId } = useWeb3React()

  const shouldFetch = typeof address === "string" && !!library

  const result = useSWR(
    shouldFetch ? ["ETHBalance", address, chainId] : null,
    getETHBalance(library)
  )

  useKeepSWRDataLiveAsBlocksArrive(result.mutate)

  return result
}

export default useETHBalance
