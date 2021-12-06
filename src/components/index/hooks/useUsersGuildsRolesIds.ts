import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import fetcher from "utils/fetcher"

const fetchUsersRoles = (endpoint: string) =>
  fetcher(endpoint).then((data) => ({
    usersRolesIds: data?.roles,
    usersGuildsIds: data?.guilds,
  }))

const useUsersGuildsRolesIds = () => {
  const { account } = useWeb3React()

  const shouldFetch = !!account

  const { data } = useSWR(
    shouldFetch ? `/user/getUserMemberships/${account}` : null,
    fetchUsersRoles,
    {
      refreshInterval: 10000,
      fallbackData: {
        usersRolesIds: null,
        usersGuildsIds: null,
      },
    }
  )

  return data
}

export default useUsersGuildsRolesIds
