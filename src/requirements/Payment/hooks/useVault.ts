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
  collected: BigNumber
  multiplePayments: boolean
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
    data: swrResponse?.data ?? {
      owner: undefined,
      fee: undefined,
      token: undefined,
      collected: undefined,
      multiplePayments: undefined,
    },
  }
}

export default useVault
