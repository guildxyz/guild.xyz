import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { PoapEventDetails } from "types"

const usePoapEventDetails = (
  poapIdentifier?: number
): {
  poapEventDetails: PoapEventDetails
  isPoapEventDetailsLoading: boolean
  mutatePoapEventDetails: KeyedMutator<any>
} => {
  const { poapData } = useCreatePoapContext()
  const { data, isValidating, mutate } = useSWRImmutable(
    typeof poapData?.id === "number" || typeof poapIdentifier === "number"
      ? `/assets/poap/eventDetails/${poapData?.id ?? poapIdentifier}`
      : null
  )

  return {
    poapEventDetails: data,
    isPoapEventDetailsLoading: isValidating,
    mutatePoapEventDetails: mutate,
  }
}

export default usePoapEventDetails
