import { PiKey } from "react-icons/pi"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const uniqueTextData = {
  icon: PiKey,
  name: "Unique secret",
  colorScheme: "gray",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} as const satisfies RewardData
