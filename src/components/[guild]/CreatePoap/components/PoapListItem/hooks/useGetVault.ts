import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import useFeeCollectorContract from "hooks/useFeeCollectorContract"
import useSWR, { KeyedMutator } from "swr"

type GetVaultResponse = {
  eventId: number
  owner: string
  token: string
  fee: BigNumber
  collected: BigNumber
}

const fetchGetVault = (
  _: string,
  contract: Contract,
  vaultId: number
): Promise<GetVaultResponse> =>
  contract
    .getVault(vaultId)
    .then((res) => {
      const [rawEventId, owner, token, fee, collected] = res
      const eventId = parseInt(rawEventId?.toString())

      return { eventId, owner, token, fee, collected }
    })
    .catch((_) => ({
      eventId: null,
      owner: null,
      token: null,
      fee: null,
      collected: null,
    }))

const useGetVault = (
  vaultId: number
): {
  getVaultData: GetVaultResponse
  isGetVaultDataLoading: boolean
  mutateGetVaultData: KeyedMutator<any>
} => {
  const feeCollectorContract = useFeeCollectorContract()

  const { data, isValidating, mutate } = useSWR(
    typeof vaultId === "number" && feeCollectorContract
      ? ["getVault", feeCollectorContract, vaultId]
      : null,
    fetchGetVault,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    getVaultData: data,
    isGetVaultDataLoading: isValidating,
    mutateGetVaultData: mutate,
  }
}

export default useGetVault
