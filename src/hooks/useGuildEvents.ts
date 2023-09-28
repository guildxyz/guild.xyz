import useSWRImmutable from "swr/immutable"
import { EventSourcesKey, OneOf, supportedEventSources } from "types"

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

type DiscordEvent = {
  id: string
  guildId: string
  channelId?: string
  creatorId?: string
  name: string
  description?: string
  scheduledStartTimestamp: number
  scheduledEndTimestamp?: number
  privacyLevel: number
  status: number
  entityType: number
  entityId?: string
  userCount?: number
  creator?: number
  entityMetadata?: {
    location: string
  }
  image?: string
}

const DiscordEventToGuildEvent = (
  discordEvent: DiscordEvent,
  guildId: number
): GuildEvent => ({
  description: discordEvent.description,
  title: discordEvent.name,
  eventType: supportedEventSources[3],
  image: `https://cdn.discordapp.com/guild-events/${discordEvent.id}/${discordEvent.image}.png?size=512`,
  location: discordEvent.entityMetadata.location,
  memberCount: discordEvent.userCount,
  start: discordEvent.scheduledStartTimestamp,
  end: discordEvent.scheduledEndTimestamp,
  url: `https://discord.com/events/${guildId}/${discordEvent.id}`,
})

const useGuildEvents = (platformGuildId: string, guildId: number) => {
  const swrResponseEvents = useSWRImmutable<
    OneOf<
      { events: GuildEvent[] },
      { errors: Array<{ type: EventSourcesKey; msg: any }> }
    >
  >(guildId ? `/v2/guilds/${guildId}/events` : null)

  const swrResponseDiscord = useSWRImmutable<
    OneOf<{ events: DiscordEvent[] }, { error: any }>
  >(platformGuildId ? `/discord/events/${platformGuildId}` : null)

  const data = []

  if (swrResponseEvents.data?.events) data.push(...swrResponseEvents.data?.events)
  if (swrResponseDiscord.data?.events)
    data.push(
      ...swrResponseDiscord.data?.events.map((event) =>
        DiscordEventToGuildEvent(event, guildId)
      )
    )

  const error = []

  if (swrResponseEvents.error)
    error.push({ type: "Guild.xyz", ...swrResponseEvents.error })
  if (swrResponseEvents.data?.errors)
    error.push(
      ...swrResponseEvents.data?.errors.filter((err) => err.type !== "DISCORD")
    )
  if (swrResponseDiscord.error)
    error.push({ type: "Guild.xyz", ...swrResponseDiscord.error })
  if (swrResponseDiscord.data?.error) error.push(...swrResponseDiscord.data?.error)

  return {
    isLoading: swrResponseEvents.isLoading || swrResponseDiscord.isLoading,
    data:
      swrResponseEvents.data?.events || swrResponseDiscord.data?.events
        ? data
        : undefined,
    error,
  }
}

export default useGuildEvents
export type { GuildEvent }
