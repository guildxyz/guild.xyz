import useSWRImmutable from "swr/immutable"
import { PoapEventDetails } from "types"

const usePoapEventDetails = (
  poapIdentifier: number
): {
  poapEventDetails: PoapEventDetails
  isPoapEventDetailsLoading: boolean
} => {
  const { data, isValidating } = useSWRImmutable(
    typeof poapIdentifier === "number"
      ? `/assets/poap/eventDetails/${poapIdentifier}`
      : null
  )

  return { poapEventDetails: data, isPoapEventDetailsLoading: isValidating }
}

export default usePoapEventDetails
