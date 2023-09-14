import useSWR, { SWRConfiguration } from "swr"

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

const fallbackData = []

const useDiscordEvents = (
  paltformGuildId: string,
  option?: {
    swrOptions?: SWRConfiguration
  }
) => {
  const { data, isValidating, isLoading, error, mutate } = useSWR(
    paltformGuildId ? `/discord/events/${paltformGuildId}` : null,
    {
      fallbackData,
      revalidateOnFocus: false,
      ...option?.swrOptions,
    }
  )

  return {
    data: data.events ? ([...data.events] as DiscordEvent[]) : [],
    isValidating,
    isLoading,
    isError: error || data.error,
    mutate,
  }
}

export default useDiscordEvents
export type { DiscordEvent }
