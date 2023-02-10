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
}

const fetchVault = async (
  _: string,
  vaultId: string,
  chain: string
): Promise<GetVaultResponse> => {
  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0], Chains[chain])
  const feeCollectorContract = new Contract(
    FEE_COLLECTOR_CONTRACT[Chains[chain]],
    FEE_COLLECTOR_ABI,
    provider
  )

  try {
    const contractRes = await feeCollectorContract.getVault(vaultId)

    if (!contractRes) return undefined

    return {
      owner: contractRes.owner,
      token: contractRes.token,
      fee: contractRes.fee,
      collected: contractRes.collected,
    }
  } catch (error) {
    throw error
  }
}

const useVault = (vaultId: string, chain: string): SWRResponse<GetVaultResponse> =>
  useSWRImmutable(vaultId && chain ? ["vault", vaultId, chain] : null, fetchVault)

export default useVault
