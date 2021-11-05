import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import fetchApi from "utils/fetchApi"

const fetchUsersGuilds = (endpoint: string) =>
  fetchApi(endpoint).then((data) => ({
    usersGuildsIds: data?.guilds,
    usersHallsIds: data?.halls,
  }))

const useUsersHallsGuilds = () => {
  const { account } = useWeb3React()

  const shouldFetch = !!account

  const { data } = useSWR(
    shouldFetch ? `/user/getUserMemberships/${account}` : null,
    fetchUsersGuilds,
    {
      refreshInterval: 10000,
      fallbackData: {
        usersGuildsIds: null,
        usersHallsIds: null,
      },
    }
  )

  return data
}

export default useUsersHallsGuilds
