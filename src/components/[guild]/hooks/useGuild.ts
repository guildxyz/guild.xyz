import useSWRWithOptionalAuth, {
  mutateOptionalAuthSWRKey,
} from "hooks/useSWRWithOptionalAuth"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { unstable_serialize, useSWRConfig } from "swr"
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

  // If we fetch guild by id, we populate the urlName cache too and vice versa
  useEffect(() => {
    if (!data) return

    if (typeof id === "string") {
      mutateOptionalAuthSWRKey(`/v2/guilds/guild-page/${data.id}`, () => data, {
        revalidate: false,
      })
    }

    if (typeof id === "number") {
      mutateOptionalAuthSWRKey(`/v2/guilds/guild-page/${data.urlName}`, () => data, {
        revalidate: false,
      })
    }
  }, [data, id])

  return {
    ...data,
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
  const guildPageFromCache = cache.get(
    unstable_serialize([`/v2/guilds/guild-page/${id}`, { method: "GET", body: {} }])
  )?.data as SimpleGuild

  const { data, ...swrProps } = useSWRImmutable<SimpleGuild>(
    id && !guildPageFromCache ? `/v2/guilds/${id}` : null
  )

  return {
    ...(guildPageFromCache ?? data),
    ...swrProps,
  }
}

export default useGuild
export { useSimpleGuild }
