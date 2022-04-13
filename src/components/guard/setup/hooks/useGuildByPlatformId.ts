import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import { Guild } from "types"

const useGuildByPlatformId = (
  platformId: string
): Partial<Guild & { hasFreeEntry: boolean }> => {
  const shouldFetch = platformId?.length > 0
  const { data } = useSWRImmutable<Guild>(
    shouldFetch ? `/guild/platformId/${platformId}` : null
  )

  const hasFreeEntry = useMemo(
    () =>
      data?.roles?.some((role) =>
        role.requirements.some((req) => req.type === "FREE")
      ),
    [data?.roles]
  )

  if (!data) return {}
  return {
    ...data,
    hasFreeEntry,
  }
}

export default useGuildByPlatformId
