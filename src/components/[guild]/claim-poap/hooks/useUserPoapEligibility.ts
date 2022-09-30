import { useWeb3React } from "@web3-react/core"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"

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
  } = useSWRImmutable(
    account && poapIdentifier
      ? `/assets/poap/checkUserPoapEligibility/${poapIdentifier}/${account}`
      : null,
    {
      fallbackData: {
        hasPaid: null,
        voiceEligibility: null,
      },
    }
  )

  return { data, hasPaidLoading, mutate }
}

export default useUserPoapEligibility
