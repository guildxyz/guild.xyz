import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import { useWeb3React } from "@web3-react/core"
import ERC20_ABI from "constants/abis/erc20abi.json"
import useContract from "hooks/useContract"
import useSWR from "swr"

const getTokenData =
  (contract: Contract) =>
  (_: string): Promise<[string, string]> =>
    Promise.all([contract.name(), contract.symbol()]).catch((error) => {
      /**
       * This means, that the error occured because the user is on a wrong chain, if
       * we were revalidating on this error, it would occur again until the the user
       * doesn't switch to the correct chain
       */
      if (error.code === Logger.errors.CALL_EXCEPTION) return [null, null]
      throw error
    })

const useTokenData = (address: string) => {
  const { active, chainId } = useWeb3React()
  const shouldFetch = /^0x[A-F0-9]{40}$/i.test(address) && active

  const contract = useContract(shouldFetch ? address : null, ERC20_ABI)

  const swrResponse = useSWR<[string, string]>(
    shouldFetch ? ["tokenData", address, chainId] : null,
    getTokenData(contract),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 100,
    }
  )

  return {
    ...swrResponse,
    /**
     * Doing this instead of using initialData to make sure it fetches when
     * shouldFetch becomes true
     */
    data: swrResponse.data ?? [undefined, undefined],
  }
}

export default useTokenData
