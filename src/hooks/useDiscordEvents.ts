import useSWRImmutable from "swr/immutable"
import { EventSourcesKey, OneOf } from "types"

type DiscordEvent = {
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

const useDiscordEvents = (paltformGuildId: number) => {
  const swrResponse = useSWRImmutable<
    OneOf<{ events: DiscordEvent[] }, { errors: any }>
  >(paltformGuildId ? `/v2/guilds/${paltformGuildId}/events` : null)

  return {
    ...swrResponse,
    data: !swrResponse.data?.errors ? swrResponse.data?.events : undefined,
    // When Discord API has an issue, the response from the guild is 200, and the payload contains an error object from Discord.
    error: swrResponse.error || swrResponse.data?.errors,
  }
}

export default useDiscordEvents
export type { DiscordEvent }
