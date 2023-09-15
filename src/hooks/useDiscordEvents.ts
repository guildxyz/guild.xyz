import useSWRImmutable from "swr/immutable"

type DiscordEvent = {
  id: string
  guildId: string
  channelId?: string
  creatorId?: string
  name: string
  description?: string
  scheduledStartTimestamp: string
  scheduledEndTimestamp?: string
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

const useDiscordEvents = (paltformGuildId: string) => {
  const swrResponse = useSWRImmutable(
    paltformGuildId ? `/discord/events/${paltformGuildId}` : null
  )

  return {
    ...swrResponse,
    data: !swrResponse.data?.error ? swrResponse.data?.events ?? [] : undefined,
    error: swrResponse.error || swrResponse.data?.error,
  }
}

export default useDiscordEvents
export type { DiscordEvent }
