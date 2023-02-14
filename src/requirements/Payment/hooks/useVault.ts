import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Chain, Chains, RPC } from "connectors"
import FEE_COLLECTOR_ABI from "static/abis/newFeeCollectorAbi.json"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"

type GetVaultResponse = {
  owner: string
  token: string
  fee: BigNumber
  collected: BigNumber
  multiplePayments: boolean
  guildShareBps: number
}

const fetchVault = async (
  _: string,
  contractAddress: string,
  vaultId: string,
  chain: Chain
): Promise<GetVaultResponse & { guildShareBps: number }> => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0], Chains[chain])
  const feeCollectorContract = new Contract(
    contractAddress,
    FEE_COLLECTOR_ABI,
    provider
  )

  const [getVaultRes, guildShareBps]: [GetVaultResponse, BigNumber] =
    await Promise.all([
      feeCollectorContract.getVault(vaultId),
      feeCollectorContract.guildShareBps(),
    ])

  if (!getVaultRes || !guildShareBps) return undefined

  return {
    ...getVaultRes,
    guildShareBps: guildShareBps.toNumber(),
  }
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
      guildShareBps: undefined,
      owner: undefined,
      fee: undefined,
      token: undefined,
      collected: undefined,
      multiplePayments: undefined,
    },
  }
}

export default useVault
