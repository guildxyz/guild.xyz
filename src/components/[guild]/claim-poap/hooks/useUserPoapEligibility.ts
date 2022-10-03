import { useWeb3React } from "@web3-react/core"
import useSWR, { KeyedMutator } from "swr"

const useUserPoapEligibility = (
  poapIdentifier: number
): {
  data: {
    hasPaid?: boolean
    voiceEligibility?: boolean
  }
  hasPaidLoading: boolean
  mutate: KeyedMutator<any>
} => {
  const { account } = useWeb3React()

  const {
    data,
    isValidating: hasPaidLoading,
    mutate,
  } = useSWR(
    account && poapIdentifier
      ? `/assets/poap/checkUserPoapEligibility/${poapIdentifier}/${account}`
      : null,
    {
      fallbackData: {
        hasPaid: null,
        voiceEligibility: null,
      },
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return { data, hasPaidLoading, mutate }
}

export default useUserPoapEligibility
