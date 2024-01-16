import { useFetcherWithSign } from "../utils/fetcher"
import useSWR from "swr"
import useGuild from "../components/[guild]/hooks/useGuild"
import useUser from "../components/[guild]/hooks/useUser"
import { RolePlatform } from "../types"

export type UserReward = {
  claimed: boolean
  id: number
  rolePlatformId: RolePlatform["id"]
  uniqueValue: string | null
}

export const useUserRewards = () => {
  const { id: guildId } = useGuild()
  const { id: userId } = useUser()

  const fetcherWithSign = useFetcherWithSign()
  const fetchUsersRewards = (key: string) =>
    fetcherWithSign([
      key,
      {
        method: "GET",
        body: {},
      },
    ])

  return useSWR<UserReward[]>(
    userId && guildId ? `/v2/users/${userId}/rewards?guildId=${guildId}` : null,
    fetchUsersRewards
  )
}
