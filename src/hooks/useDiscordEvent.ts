import { SWRConfiguration } from "swr"
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

const useDiscordEvents = (
  paltformGuildId: string,
  option?: {
    swrOptions?: SWRConfiguration
  }
) => {
  const { data, isValidating, isLoading, error, mutate } = useSWRImmutable(
    paltformGuildId ? `/discord/events/${paltformGuildId}` : null,
    {
      revalidateOnFocus: false,
      ...option?.swrOptions,
    }
  )

  return {
    data: data?.events ? ([...data.events] as DiscordEvent[]) : null,
    isValidating,
    isLoading,
    isError: error || data?.error,
    mutate,
  }
}

export default useDiscordEvents
export type { DiscordEvent }
