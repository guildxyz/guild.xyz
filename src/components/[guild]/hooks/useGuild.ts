import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useRouter } from "next/router"
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

  const { data, ...swrProps } = useSWRImmutable<SimpleGuild>(
    id ? `/v2/guilds/${id}` : null
  )

  return {
    ...data,
    ...swrProps,
  }
}

export default useGuild
export { useSimpleGuild }
