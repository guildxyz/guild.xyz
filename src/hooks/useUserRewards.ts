import { useFetcherWithSign } from "../utils/fetcher"
import useSWR from "swr"
import useGuild from "../components/[guild]/hooks/useGuild"
import useUser from "../components/[guild]/hooks/useUser"

export const useUserRewards = () => {
  const { id: guildId } = useGuild()
  const { id: userId } = useUser()

  const fetcherWithSign = useFetcherWithSign()
  const fetcher = (key: string) =>
    fetcherWithSign([
      key,
      {
        method: "GET",
        body: {},
      },
    ])

  return useSWR<any[]>(
    userId && guildId ? `/v2/users/${userId}/rewards?guildId=${guildId}` : null,
    fetcher
  )
}
