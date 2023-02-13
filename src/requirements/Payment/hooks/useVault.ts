import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Chains, RPC } from "connectors"
import FEE_COLLECTOR_ABI from "static/abis/newFeeCollectorAbi.json"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { FEE_COLLECTOR_CONTRACT } from "utils/guildCheckout/constants"

type GetVaultResponse = {
  owner: string
  token: string
  fee: BigNumber
  collected: BigNumber
  guildShareBps: number
}

const fetchVault = async (
  _: string,
  vaultId: string,
  chain: string
): Promise<GetVaultResponse> => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0], Chains[chain])
  const feeCollectorContract = new Contract(
    FEE_COLLECTOR_CONTRACT[chain],
    FEE_COLLECTOR_ABI,
    provider
  )

  try {
    const [getVaultRes, guildShareBps] = await Promise.all([
      feeCollectorContract.getVault(vaultId),
      feeCollectorContract.guildShareBps(),
    ])

    if (!getVaultRes || !guildShareBps) return undefined

    return {
      owner: getVaultRes.owner,
      token: getVaultRes.token,
      fee: getVaultRes.fee,
      collected: getVaultRes.collected,
      guildShareBps: guildShareBps.toNumber(),
    }
  } catch (error) {
    throw error
  }
}

const useVault = (vaultId: string, chain: string): SWRResponse<GetVaultResponse> => {
  const swrResponse = useSWRImmutable(
    vaultId && chain ? ["vault", vaultId, chain] : null,
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
    },
  }
}

export default useVault
