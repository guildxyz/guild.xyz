import { Contract } from "@ethersproject/contracts"
import ERC_20_ABI from "constants/erc20abi.json"
import useContract from "hooks/useContract"
import useSWR from "swr"

const getTokenData =
  (contract: Contract) =>
  (_: string): Promise<[string, string]> =>
    Promise.all([contract.name(), contract.symbol()])

const useTokenData = (address: string, selectedChain: string) => {
  const shouldFetch = /^0x[A-F0-9]{40}$/i.test(address) && selectedChain.length > 0
  const contract = useContract(shouldFetch ? address : null, ERC_20_ABI)

  const swrResponse = useSWR<[string, string]>(
    shouldFetch ? ["tokenData", address, selectedChain] : null,
    getTokenData(contract),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    ...swrResponse,
    data: swrResponse.data ?? [undefined, undefined],
  }
}

export default useTokenData
