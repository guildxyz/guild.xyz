import useGuild from "../components/[guild]/hooks/useGuild"
import useUser from "../components/[guild]/hooks/useUser"
import { RolePlatform } from "../types"
import useSWRWithOptionalAuth from "./useSWRWithOptionalAuth"

export type UserReward = {
  claimed: boolean
  id: number
  rolePlatformId: RolePlatform["id"]
  uniqueValue: string | null
}

export const useUserRewards = () => {
  const { id: guildId } = useGuild()
  const { id: userId } = useUser()

  return useSWRWithOptionalAuth<UserReward[]>(
    userId && guildId ? `/v2/users/${userId}/rewards?guildId=${guildId}` : null
  )
}
