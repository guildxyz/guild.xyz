import useSWR from "swr"

type ServerDataChannel = { id: string; name: string }

type ServerDataRole = {
  guild: string
  icon: string
  unicodeEmoji: any
  deleted: boolean
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
  channels: ServerDataChannel[]
  isAdmin: boolean | null
  roles: ServerDataRole[]
}

const fallbackData = {
  serverIcon: null,
  membersWithoutRole: 0,
  serverName: "",
  serverId: "",
  channels: [],
  isAdmin: undefined,
  roles: [],
}

const useServerData = (serverId: string, swrOptions = {}) => {
  const shouldFetch = serverId?.length >= 0

  const { data, isValidating, error } = useSWR<ServerData>(
    shouldFetch ? `/discord/server/${serverId}` : null,
    {
      fallbackData,
      ...swrOptions,
    }
  )

  return { data, isLoading: isValidating, error }
}

export default useServerData
