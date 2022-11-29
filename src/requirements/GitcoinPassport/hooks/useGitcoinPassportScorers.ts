import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"

const useGitcoinPassportScorers = (): {
  scorers: SelectOption[]
  isStampsLoading: boolean
} => {
  const { data, isValidating } = useSWRImmutable(
    "https://scorer.dpopp.gitcoin.co/scorer_weighted/api/scorer-weighted"
  )

  return {
    scorers:
      data?.map((scorer) => ({
        label: scorer.id,
        value: scorer.id,
      })) ?? [],
    isStampsLoading: isValidating,
  }
}

export default useGitcoinPassportScorers
