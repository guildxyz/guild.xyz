import useSWRWithOptionalAuth, {
  useMutateOptionalAuthSWRKey,
} from "hooks/useSWRWithOptionalAuth"
import { usePathname } from "next/navigation"
import { mutate as swrMutate, useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import { Guild, SimpleGuild } from "types"

// TODO: once we migrate every page to the app router, we should remove this array & use the `useParams` hook instead of `usePathname`
const EXCLUDED_ROUTES = [
  "explorer",
  "create-guild",
  "privacy-policy",
  "terms-of-use",
  "leaderboard",
  "profile",
  "superadmin",
]

const useGuildUrlNameFromPathname = (guildId?: string | number) => {
  const pathname = usePathname()
  const guildFromPathname = pathname?.split("/").at(1)

  const idToReturn = guildId ?? guildFromPathname

  if (EXCLUDED_ROUTES.includes(idToReturn?.toString() ?? "")) return undefined

  return guildId ?? guildFromPathname
}

const useGuild = (guildId?: string | number) => {
  const id = useGuildUrlNameFromPathname(guildId)

  const publicSWRKey = `/v2/guilds/guild-page/${id}`
  const mutateOptionalAuthSWRKey = useMutateOptionalAuthSWRKey()

  const { data, mutate, isLoading, error, isSigned } = useSWRWithOptionalAuth<Guild>(
    id ? publicSWRKey : null,
    {
      // If we fetch guild by id, we populate the urlName cache too and vice versa
      onSuccess: (newData: Guild, key: string) => {
        const swrKeyWithId = `/v2/guilds/guild-page/${newData.id}`
        const swrKeyWithUrlName = `/v2/guilds/guild-page/${newData.urlName}`

        if (typeof id === "string") {
          if (key === publicSWRKey) {
            swrMutate(swrKeyWithId, newData, {
              revalidate: false,
            })
          } else {
            mutateOptionalAuthSWRKey(swrKeyWithId, () => newData, {
              revalidate: false,
            })
          }
        }

        if (typeof id === "number") {
          if (key === publicSWRKey) {
            swrMutate(swrKeyWithUrlName, newData, {
              revalidate: false,
            })
          } else {
            mutateOptionalAuthSWRKey(swrKeyWithUrlName, () => newData, {
              revalidate: false,
            })
          }
        }
      },
    },
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
  const id = useGuildUrlNameFromPathname(guildId)

  const { cache } = useSWRConfig()
  const guildPageFromCache = cache.get(`/v2/guilds/guild-page/${id}`)
    ?.data as SimpleGuild

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
