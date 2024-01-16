import { RolePlatform } from "../types"
import { useUserRewards } from "./useUserRewards"

export const useIsRewardClaimed = (rolePlatformId: RolePlatform["id"]) => {
  const { isLoading, data: userRewards } = useUserRewards()

  const claimed = !isLoading
    ? userRewards?.find((reward) => reward.id === rolePlatformId)?.claimed
    : undefined

  return { isLoading, claimed }
}
