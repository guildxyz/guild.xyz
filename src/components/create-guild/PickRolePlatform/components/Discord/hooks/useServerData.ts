import useSWR from "swr"

const fallbackData = {
  serverIcon: null,
  membersWithoutRole: 0,
  serverName: "",
  serverId: "",
  channels: [],
  isAdmin: null,
}

const useServerData = (serverId: string, swrOptions = {}) => {
  const shouldFetch = serverId?.length >= 0

  const { data, isValidating, error } = useSWR(
    shouldFetch ? `/discord/server/${serverId}` : null,
    {
      fallbackData,
      ...swrOptions,
    }
  )

  return { data, isLoading: isValidating, error }
}

export default useServerData
