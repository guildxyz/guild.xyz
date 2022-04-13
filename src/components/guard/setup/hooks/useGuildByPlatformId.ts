import useGuild from "components/[guild]/hooks/useGuild"
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

  const guild = useGuild(data?.id)

  const hasFreeEntry = useMemo(
    () =>
      guild.roles?.some((role) =>
        role.requirements.some((req) => req.type === "FREE")
      ),
    [guild.roles]
  )

  if (!data) return {}
  return {
    ...guild,
    hasFreeEntry,
  }
}

export default useGuildByPlatformId
