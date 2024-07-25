import { types } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import useSWRInfinite from "swr/infinite"

const ENTRY_BATCH_SIZE = 4

export default function useContestEntries() {
  const router = useRouter()
  const { id } = useGuild()

  function getKey(pageIndex: number, previousPageData: any) {
    if (previousPageData && previousPageData.length <= 0) return null
    if (!id || !router.query.contestId) return null
    return `/v2/guilds/${id}/contests/${router.query.contestId}/entries?offset=${
      pageIndex * ENTRY_BATCH_SIZE
    }&limit=${ENTRY_BATCH_SIZE}`
  }

  const swrResult = useSWRInfinite<types.GuildContestEntry[]>(getKey, {
    refreshInterval: 10_000,
    dedupingInterval: 10_000,
    revalidateAll: true,
  })

  const entries = swrResult.data ? swrResult.data.flat() : undefined

  const { data, ...rest } = swrResult

  return { ...rest, entries }
}
