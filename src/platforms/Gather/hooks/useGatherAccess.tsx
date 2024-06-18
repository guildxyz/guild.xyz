import useDebouncedState from "hooks/useDebouncedState"
import useSWRImmutable from "swr/immutable"
import { gatherSpaceUrlToSpaceId } from "../useGatherCardProps"

const useGatherAccess = (gatherApiKey: string, gatherSpaceId: string) => {
  const apiKey = useDebouncedState(gatherApiKey)
  const spaceId = useDebouncedState(gatherSpaceId)

  const { data, isLoading, error } = useSWRImmutable(
    !!apiKey && !!spaceId
      ? `/api/gather?apiKey=${apiKey}&spaceId=${gatherSpaceUrlToSpaceId(spaceId)}`
      : null
  )

  return {
    success: !!data,
    isLoading,
    error,
  }
}

export default useGatherAccess
