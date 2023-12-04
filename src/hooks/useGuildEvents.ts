import useGuild from "components/[guild]/hooks/useGuild"
import useSWRImmutable from "swr/immutable"
import { EventSourcesKey, OneOf } from "types"

type GuildEvent = {
  title: string
  description: string
  start: number
  end: number
  memberCount: number
  eventType: EventSourcesKey
  location: string
  url: string
  image: string
}

const useGuildEvents = () => {
  const { id } = useGuild()

  const swrResponseEvents = useSWRImmutable<
    OneOf<
      { events: GuildEvent[] },
      { errors: Array<{ type: EventSourcesKey; msg: any }> }
    >
  >(id ? `/v2/guilds/${id}/events` : null)

  const error = []
  const serverError = []

  if (swrResponseEvents.error)
    serverError.push({ type: "LUMA, EVENTBRITE, LINK3", ...swrResponseEvents.error })

  if (swrResponseEvents.data?.errors)
    error.push(
      ...swrResponseEvents.data.errors.filter((err) => err.type !== "DISCORD")
    )

  return {
    ...swrResponseEvents,
    data: swrResponseEvents.data?.events,
    error,
    serverError,
  }
}

export default useGuildEvents
export type { GuildEvent }
