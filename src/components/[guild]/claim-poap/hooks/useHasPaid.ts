import { useWeb3React } from "@web3-react/core"
import useSWR, { KeyedMutator } from "swr"

const useHasPaid = (
  poapIdentifier: number
): {
  hasPaid: boolean
  hasPaidLoading: boolean
  mutate: KeyedMutator<any>
} => {
  const { account } = useWeb3React()
  const {
    data: hasPaid,
    isValidating: hasPaidLoading,
    mutate,
  } = useSWR(
    account && poapIdentifier
      ? `/assets/poap/checkUserPayments/${poapIdentifier}/${account}`
      : null
  )

  return { hasPaid, hasPaidLoading, mutate }
}

export default useHasPaid
