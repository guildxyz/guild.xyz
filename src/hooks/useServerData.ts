import { Channel as EntryChannel } from "components/create-guild/EntryChannel"
import useSWR from "swr"

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
}

type ServerData = {
  serverIcon: string
  membersWithoutRole: number
  serverName: string
  serverId: string
  categories: Category[]
  isAdmin: boolean
  channels?: EntryChannel[]
  roles: Role[]
}

const fallbackData = {
  serverIcon: null,
  membersWithoutRole: 0,
  serverName: "",
  serverId: "",
  categories: [],
  isAdmin: undefined,
  channels: [],
  roles: [],
}

const useServerData = (
  serverId: string,
  { authorization, ...swrOptions }: Record<string, any> = {
    authorization: undefined,
  }
) => {
  const shouldFetch = serverId?.length >= 0

  const { data, isValidating, error } = useSWR<ServerData>(
    shouldFetch
      ? [`/discord/server/${serverId}`, { method: "POST", body: { authorization } }]
      : null,
    {
      fallbackData,
      ...swrOptions,
    }
  )

  return { data, isLoading: isValidating, error }
}

export default useServerData
