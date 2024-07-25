import { schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useSubmit from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { z } from "zod"
import useGuildContests from "./useGuildContests"

export default function useCreateGuildContest(
  options: UseSubmitOptions<z.output<typeof schemas.GuildContestSchema>> = {}
) {
  const { id } = useGuild()
  const { mutate } = useGuildContests()
  const fetcherWithSign = useFetcherWithSign()

  return useSubmit<
    z.input<typeof schemas.GuildContestCreationSchema>,
    z.output<typeof schemas.GuildContestSchema>
  >(async (body) => {
    if (!body) return

    const response = await fetcherWithSign([
      `/v2/guilds/${id}/contests`,
      { method: "POST", body },
    ])

    await mutate((prev) => [...(prev ?? []), response], { revalidate: false })

    return response
  }, options)
}
