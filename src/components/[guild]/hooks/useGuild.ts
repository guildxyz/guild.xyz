import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useRouter } from "next/router"
import { Guild } from "types"

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

export default useGuild
