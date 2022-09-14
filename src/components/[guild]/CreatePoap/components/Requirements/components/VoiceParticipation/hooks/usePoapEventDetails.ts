import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { PoapEventDetails } from "types"

const usePoapEventDetails = (): {
  poapEventDetails: PoapEventDetails
  isPoapEventDetailsLoading: boolean
  mutatePoapEventDetails: KeyedMutator<any>
} => {
  const { poapData } = useCreatePoapContext()
  const { data, isValidating, mutate } = useSWRImmutable(
    typeof poapData?.id === "number"
      ? `/assets/poap/eventDetails/${poapData.id}`
      : null
  )

  return {
    poapEventDetails: data,
    isPoapEventDetailsLoading: isValidating,
    mutatePoapEventDetails: mutate,
  }
}

export default usePoapEventDetails
