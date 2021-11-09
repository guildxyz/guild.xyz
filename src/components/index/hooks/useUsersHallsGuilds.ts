import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr"
import { Guild, Hall } from "temporaryData/types"

const filterUsersGuildsHalls = (_, all, usersIds, account) =>
  all.filter(
    ({ id, owner: { addresses } }) =>
      usersIds?.includes(id) || addresses.includes(account?.toLowerCase())
  )

const useUsersHallsGuilds = (all: Array<Guild | Hall>, usersIds: string[]) => {
  const { account } = useWeb3React()
  const shouldFetch = account && usersIds

  const { data } = useSWRImmutable(
    shouldFetch ? ["userGuilds", all, usersIds, account] : null,
    filterUsersGuildsHalls,
    { fallbackData: [], dedupingInterval: 9000000, revalidateOnFocus: false }
  )

  return data
}

export default useUsersHallsGuilds
