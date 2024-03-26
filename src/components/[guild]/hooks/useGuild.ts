import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import { Guild, SimpleGuild } from "types"

const useGuild = (guildId?: string | number) => {
  const router = useRouter()
  const id = guildId ?? router.query.guild

  const { data, mutate, isLoading, error, isSigned } = useSWRWithOptionalAuth<Guild>(
    id ? `/v2/guilds/guild-page/${id}` : null,
    undefined,
    undefined,
    false
  )

  // TODO: remove this once we don't return trequirements from the API
  const filteredData: Guild = {
    ...data,
    roles: data.roles.map((role) => ({
      ...role,
      requirements: undefined,
    })),
  }

  return {
    ...filteredData,
    isDetailed: isSigned,
    isLoading,
    error,
    mutateGuild: mutate,
  }
}

const useSimpleGuild = (guildId?: string | number) => {
  const router = useRouter()
  const id = guildId ?? router.query.guild

  const { cache } = useSWRConfig()
  const guildFromCache = cache.get(`/v2/guilds/guild-page/${id}`)
    ?.data as SimpleGuild

  const { data, ...swrProps } = useSWRImmutable<SimpleGuild>(
    id && !guildFromCache ? `/v2/guilds/${id}` : null
  )

  return {
    ...(guildFromCache ?? data),
    ...swrProps,
  }
}

export default useGuild
export { useSimpleGuild }
