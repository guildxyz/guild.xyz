import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chain, RPC } from "connectors"
import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"

const fetchHasPaid = async ([_, contractAddress, account, vaultId, chain]) => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const feeCollectorContract = new Contract(
    contractAddress,
    FEE_COLLECTOR_ABI,
    provider
  )

  return feeCollectorContract.hasPaid(vaultId, account)
}

const useHasPaid = (
  contractAddress: string,
  vaultId: number,
  chain?: Chain
): SWRResponse<boolean> => {
  const { account } = useWeb3React()
  const shouldFetch = contractAddress && account && vaultId

  return useSWRImmutable(
    shouldFetch ? ["hasPaid", contractAddress, account, vaultId, chain] : null,
    fetchHasPaid
  )
}

export default useHasPaid
