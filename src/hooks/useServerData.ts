import { Channel as EntryChannel } from "components/[guild]/Onboarding/components/SummonMembers/components/EntryChannel"
import useSWR, { SWRConfiguration } from "swr"

export type Channel = { id: string; name: string; roles: string[] }

export type Category = {
  id: string
  name: string
  channels: Channel[]
}

export type Role = {
  guild: string
  icon: string
  unicodeEmoji: string
  id: string
  name: string
  color: number
  hoist: boolean
  rawPosition: number
  permissions: string
  managed: boolean
  mentionable: boolean
  createdTimestamp: number
  memberCount: number
}

type ServerData = {
  serverIcon: string
  serverName: string
  serverId: string
  categories: Category[]
  isAdmin: boolean
  channels?: EntryChannel[]
  roles: Role[]
}

const fallbackData = {
  serverIcon: null,
  serverName: "",
  serverId: "",
  categories: [],
  isAdmin: undefined,
  channels: [],
  roles: [],
}

const useServerData = (
  serverId: string,
  option?: {
    memberCountDetails?: boolean
    swrOptions?: SWRConfiguration
  }
) => {
  const shouldFetch = serverId?.length >= 0
  const { data, isValidating, error, mutate } = useSWR<ServerData>(
    shouldFetch
      ? [
          `/discord/server/${serverId}/${option?.memberCountDetails}`,
          { method: "GET" },
        ]
      : null,
    {
      fallbackData,
      revalidateOnFocus: false,
      ...option?.swrOptions,
    }
  )

  return {
    data: {
      ...data,
      channels: data.categories?.map((category) => category.channels)?.flat(),
    },
    isLoading: isValidating,
    error,
    mutate,
  }
}

export default useServerData
