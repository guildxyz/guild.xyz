import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { PoapEventDetails } from "types"

const usePoapEventDetails = (
  poapIdentifier: number
): {
  poapEventDetails: PoapEventDetails
  isPoapEventDetailsLoading: boolean
  mutatePoapEventDetails: KeyedMutator<any>
} => {
  const { data, isValidating, mutate } = useSWRImmutable(
    typeof poapIdentifier === "number"
      ? `/assets/poap/eventDetails/${poapIdentifier}`
      : null
  )

  return {
    poapEventDetails: data,
    isPoapEventDetailsLoading: isValidating,
    mutatePoapEventDetails: mutate,
  }
}

export default usePoapEventDetails
