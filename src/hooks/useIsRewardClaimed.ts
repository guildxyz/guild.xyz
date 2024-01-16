import { RolePlatform } from "../types"
import { useGetUserRewards } from "./useGetUserRewards"

export const useIsRewardClaimed = (platformId: RolePlatform["id"]) => {
  const { isLoading, data: userRewards } = useGetUserRewards()

  const claimed = !isLoading
    ? userRewards?.find((reward) => reward.id === platformId)?.claimed
    : undefined

  return { isLoading, claimed }
}
