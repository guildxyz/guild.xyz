import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chain, RPC } from "connectors"
import FEE_COLLECTOR_ABI from "static/abis/newFeeCollectorAbi.json"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { FEE_COLLECTOR_CONTRACT } from "utils/guildCheckout/constants"

const fetchHasPaid = async (
  _: string,
  account: string,
  vaultId: number,
  chain: Chain
) => {
  if (!FEE_COLLECTOR_CONTRACT[chain]) return undefined

  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const feeCollectorContract = new Contract(
    FEE_COLLECTOR_CONTRACT[chain],
    FEE_COLLECTOR_ABI,
    provider
  )

  return feeCollectorContract.hasPaid(vaultId, account)
}

const useHasPaid = (vaultId: number, chain?: Chain): SWRResponse<boolean> => {
  const { account } = useWeb3React()
  const shouldFetch = account && vaultId

  return useSWRImmutable(
    shouldFetch ? ["hasPaid", account, vaultId, chain] : null,
    fetchHasPaid
  )
}

export default useHasPaid
