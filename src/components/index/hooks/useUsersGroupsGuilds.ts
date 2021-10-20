import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const fetchUsersGuilds = (_, address: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/user/getUserMemberships/${address}`).then(
    (response) =>
      response.json().then((data) => ({
        usersGuildsIds: data.guilds,
        usersGroupsIds: data.groups,
      }))
  )

const useUsersGroupsGuilds = () => {
  const { account } = useWeb3React()

  const shouldFetch = !!account

  const { data } = useSWR(
    shouldFetch ? ["usersGuilds", account] : null,
    fetchUsersGuilds,
    {
      refreshInterval: 10000,
      fallbackData: {
        usersGuildsIds: null,
        usersGroupsIds: null,
      },
    }
  )

  return data
}

export default useUsersGroupsGuilds
