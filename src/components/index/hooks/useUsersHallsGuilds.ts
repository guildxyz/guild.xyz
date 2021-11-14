import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { Guild, Hall } from "temporaryData/types"

const filterUsersGuildsHalls = (_, all, usersIds, account) =>
  all.filter(
    ({ id, owner: { addresses } }) =>
      usersIds?.includes(id) || addresses.includes(account?.toLowerCase())
  )

const useUsersHallsGuilds = (all: Array<Guild | Hall>, usersIds: string[]) => {
  const { account } = useWeb3React()
  const shouldFetch = account && !!all.length && !!usersIds?.length

  const { data } = useSWR(
    shouldFetch ? ["usersHallsGuilds", all, usersIds, account] : null,
    filterUsersGuildsHalls,
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 9000000,
    }
  )

  return data
}

export default useUsersHallsGuilds
