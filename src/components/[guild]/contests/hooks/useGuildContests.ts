import { schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useSWRImmutable from "swr/immutable"
import { z } from "zod"

export default function useGuildContests() {
  const { id } = useGuild()
  const fetcherWithSign = useFetcherWithSign()
  const shouldFetch = !!fetcherWithSign && !!id

  return useSWRImmutable<Array<z.output<typeof schemas.GuildContestSchema>>>(
    shouldFetch ? [`/v2/guilds/${id}/contests`, { method: "GET" }] : null,
    fetcherWithSign
  )
}
