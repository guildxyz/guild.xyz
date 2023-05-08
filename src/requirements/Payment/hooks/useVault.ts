import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Chain, Chains, RPC } from "connectors"
import FEE_COLLECTOR_ABI from "static/abis/feeCollectorAbi.json"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"

type GetVaultResponse = {
  owner: string
  token: string
  fee: BigNumber
  multiplePayments: boolean

  // it's 'collected' in legacy contracts and 'balance' in the new one
  balance?: BigNumber
  collected?: BigNumber
}

const fetchVault = async (
  _: string,
  contractAddress: string,
  vaultId: string,
  chain: Chain
): Promise<GetVaultResponse> => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0], Chains[chain])
  const feeCollectorContract = new Contract(
    contractAddress,
    FEE_COLLECTOR_ABI,
    provider
  )

  const getVaultRes: GetVaultResponse = feeCollectorContract.getVault(vaultId)

  if (!getVaultRes) return undefined

  return getVaultRes
}

const useVault = (
  contractAddress: string,
  vaultId: number | string,
  chain: Chain
): SWRResponse<GetVaultResponse> => {
  const shouldFetch = contractAddress && vaultId && chain

  const swrResponse = useSWRImmutable(
    shouldFetch ? ["vault", contractAddress, vaultId, chain] : null,
    fetchVault
  )
  return {
    ...swrResponse,
    data: {
      owner: swrResponse?.data?.owner,
      fee: swrResponse?.data?.fee,
      token: swrResponse?.data?.token,
      collected: swrResponse?.data?.balance ?? swrResponse?.data?.collected,
      multiplePayments: swrResponse?.data?.multiplePayments,
    },
  }
}

export default useVault
