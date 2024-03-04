import { RolePlatform } from "../types"
import { useUserRewards } from "./useUserRewards"

export const useClaimedReward = (rolePlatformId: RolePlatform["id"]) => {
  const { isLoading, mutate, data: userRewards } = useUserRewards()
  const userReward = userRewards?.find(
    (reward) => reward.rolePlatformId === rolePlatformId
  )

  return {
    isLoading,
    claimed: userReward?.claimed,
    uniqueValue: userReward?.uniqueValue,
    mutate,
  }
}
