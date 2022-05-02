import useSWR from "swr"
import { Role } from "types"
import { Channel as EntryChannel } from "../components/EntryChannel"

export type Channel = { id: string; name: string; roles: string[] }

export type Category = {
  id: string
  name: string
  channels: Channel[]
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
