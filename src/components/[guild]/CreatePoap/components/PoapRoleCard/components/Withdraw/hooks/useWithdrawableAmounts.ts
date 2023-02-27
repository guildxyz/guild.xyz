import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"

type WithdrawableAmountsResponse = {
  id: number
  chainId: number
  vaultId: number
  tokenSymbol: string
  collected: number
}[]

const useWithdrawableAmounts = (
  guildId: number,
  poapId: number
): {
  withdrawableAmounts: WithdrawableAmountsResponse
  isWithdrawableAmountsLoading: boolean
  mutateWithdrawableAmounts: KeyedMutator<any>
} => {
  const {
    data: withdrawableAmounts,
    isValidating: isWithdrawableAmountsLoading,
    mutate: mutateWithdrawableAmounts,
  } = useSWRImmutable(
    typeof guildId === "number" && typeof poapId === "number"
      ? `/api/poap/get-withdrawable-amount/${guildId}/${poapId}`
      : null
  )

  return {
    withdrawableAmounts,
    isWithdrawableAmountsLoading,
    mutateWithdrawableAmounts,
  }
}

export default useWithdrawableAmounts
