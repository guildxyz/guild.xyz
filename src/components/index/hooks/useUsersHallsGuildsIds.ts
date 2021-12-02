import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import fetcher from "utils/fetcher"

const fetchUsersGuilds = (endpoint: string) =>
  fetcher(endpoint).then((data) => ({
    usersGuildsIds: data?.guilds,
    usersHallsIds: data?.groups,
  }))

const useUsersHallsGuildsIds = () => {
  const { account } = useWeb3React()

  const shouldFetch = !!account

  const { data } = useSWR(
    shouldFetch
      ? `${process.env.NEXT_PUBLIC_API}/user/getUserMemberships/${account}`
      : null,
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

export default useUsersHallsGuildsIds
