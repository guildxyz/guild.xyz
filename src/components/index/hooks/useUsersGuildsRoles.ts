import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { Guild, Role } from "temporaryData/types"

const filterUsersRolesGuilds = (_, all, usersIds, account) =>
  all.filter(
    ({ id, owner: { addresses } }) =>
      usersIds?.includes(id) || addresses.includes(account.toLowerCase())
  )

const useUsersGuildsRoles = (all: Array<Role | Guild>, usersIds: string[]) => {
  const { account } = useWeb3React()
  const shouldFetch = account && !!all.length

  const { data } = useSWR(
    shouldFetch ? ["usersGuildsRoles", all, usersIds, account] : null,
    filterUsersRolesGuilds,
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 9000000,
    }
  )

  return data
}

export default useUsersGuildsRoles
