import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"

const useGitcoinPassportStamps = (): {
  stamps: SelectOption[]
  isStampsLoading: boolean
} => {
  const { data, isValidating } = useSWRImmutable(
    "https://scorer.dpopp.gitcoin.co/registry/api/stamp"
  )

  return {
    stamps:
      data?.map((stamp) => ({
        label: stamp.provider,
        value: stamp.provider,
      })) ?? [],
    isStampsLoading: isValidating,
  }
}

export default useGitcoinPassportStamps
