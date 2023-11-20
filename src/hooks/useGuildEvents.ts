import useGuild from "components/[guild]/hooks/useGuild"
import useSWRImmutable from "swr/immutable"
import { EventSourcesKey, OneOf, PlatformType, supportedEventSources } from "types"

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

const discordEventToGuildEvent = (
  discordEvent: DiscordEvent,
  guildId: number
): GuildEvent => ({
  description: discordEvent.description,
  title: discordEvent.name,
  eventType: supportedEventSources[3],
  image: discordEvent.image
    ? `https://cdn.discordapp.com/guild-events/${discordEvent.id}/${discordEvent.image}.png?size=512`
    : null,
  location: discordEvent.entityMetadata.location,
  memberCount: discordEvent.userCount,
  start: discordEvent.scheduledStartTimestamp,
  end: discordEvent.scheduledEndTimestamp,
  url: `https://discord.com/events/${guildId}/${discordEvent.id}`,
})

const useGuildEvents = () => {
  const { id: guildId, guildPlatforms } = useGuild()

  const platformGuildId = guildPlatforms?.find(
    (platform) => platform.platformId === PlatformType.DISCORD
  )?.platformGuildId

  const swrResponseEvents = useSWRImmutable<
    OneOf<
      { events: GuildEvent[] },
      { errors: Array<{ type: EventSourcesKey; msg: any }> }
    >
  >(guildId ? `/v2/guilds/${guildId}/events` : null)

  const data = []

  if (swrResponseEvents.data?.events) data.push(...swrResponseEvents.data.events)

  const error = []
  const serverError = []

  if (swrResponseEvents.error)
    serverError.push({ type: "LUMA, EVENTBRITE, LINK3", ...swrResponseEvents.error })

  if (swrResponseEvents.data?.errors)
    error.push(
      ...swrResponseEvents.data.errors.filter((err) => err.type !== "DISCORD")
    )


  const mutate = () => {
    swrResponseEvents.mutate()
  }

  return {
    isValidating: swrResponseEvents.isValidating,
    data:
      swrResponseEvents.data?.events
        ? data
        : undefined,
    error,
    serverError,
    mutate,
  }
}

export default useGuildEvents
export type { GuildEvent }
