import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { Guild } from "temporaryData/types"

const filterUsersGuilds = (_, all, usersIds, account) =>
  all.filter(
    ({ id, owner: { addresses } }) =>
      usersIds?.includes(id) || addresses.includes(account.toLowerCase())
  )

const useUsersGuilds = (all: Array<Guild>, usersIds: string[]) => {
  const { account } = useWeb3React()
  const shouldFetch = account && !!all.length

  const { data } = useSWR(
    shouldFetch ? ["usersGuilds", all, usersIds, account] : null,
    filterUsersGuilds,
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 9000000,
    }
  )

  return data
}

export default useUsersGuilds
