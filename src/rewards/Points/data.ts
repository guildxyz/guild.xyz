import { PiStar } from "react-icons/pi"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const pointsData = {
  icon: PiStar,
  name: "Points",
  colorScheme: "gray",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
} as const satisfies RewardData
