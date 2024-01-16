import { RolePlatform } from "../types"
import { useUserRewards } from "./useUserRewards"

export const useIsRewardClaimed = (platformId: RolePlatform["id"]) => {
  const { isLoading, data: userRewards } = useUserRewards()

  const claimed = !isLoading
    ? userRewards?.find((reward) => reward.id === platformId)?.claimed
    : undefined

  return { isLoading, claimed }
}
