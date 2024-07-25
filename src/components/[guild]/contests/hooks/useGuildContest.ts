import { schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"
import { z } from "zod"

export default function useGuildContest() {
  const { id } = useGuild()
  const router = useRouter()
  const fetcherWithSign = useFetcherWithSign()

  const shouldFetch = !!fetcherWithSign && !!id && !!router.query.contestId

  return useSWRImmutable<z.output<typeof schemas.GuildContestSchema>>(
    shouldFetch
      ? [`/v2/guilds/${id}/contests/${router.query.contestId}`, { method: "GET" }]
      : null,
    fetcherWithSign
  )
}
