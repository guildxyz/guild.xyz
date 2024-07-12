import { Star } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const pointsData = {
  icon: Star,
  name: "Points",
  colorScheme: "gray",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
} as const satisfies RewardData
