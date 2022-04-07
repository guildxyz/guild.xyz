import useSWR from "swr"
import { Guild } from "types"

const useGuildByPlatformId = (platformId: string) => {
  const shouldFetch = platformId?.length > 0
  const { data, isValidating, mutate, error } = useSWR<
    Guild & { hasFreeEntry: boolean }
  >(shouldFetch ? `/guild/platformId/${platformId}` : null)

  return {
    ...(data ?? {}),
    isValidating,
    mutate,
    error,
  }
}

export default useGuildByPlatformId
