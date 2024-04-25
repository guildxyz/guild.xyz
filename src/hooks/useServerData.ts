import { Channel as EntryChannel } from "components/[guild]/Onboarding/components/SummonMembers/components/EntryChannel"
import useSWR, { SWRConfiguration } from "swr"

export type Channel = { id: string; name: string; roles: string[] }

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
  isAdmin: boolean
  channels?: EntryChannel[]
  roles: Role[]
}

const fallbackData = {
  serverIcon: null,
  serverName: "",
  serverId: "",
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
  return useSWR<ServerData>(
    shouldFetch
      ? `/v2/discord/servers/${serverId}?memberCountDetails=${
          option?.memberCountDetails || false
        }`
      : null,
    {
      fallbackData,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      ...option?.swrOptions,
    }
  )
}

export default useServerData
