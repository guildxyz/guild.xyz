import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const fetchUsersGuilds = (address: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/user/getUserMemberships/${address}`).then(
    (response) => (response.ok ? response.json() : [])
  )

const useUsersGuilds = () => {
  const { account } = useWeb3React()
  const { data } = useSWR(["usersGuilds", account], fetchUsersGuilds, {
    fallbackData: [],
  })

  return data
}

export default useUsersGuilds
