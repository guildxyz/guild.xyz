import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import XLogo from "static/icons/x.svg"

export default {
  icon: XLogo,
  name: "X",
  colorScheme: "TWITTER",
  gatedEntity: "account",
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
  isPlatform: true,
} as const satisfies RewardData

export const twitterReward = {
  icon: XLogo,
  imageUrl: "/platforms/x.svg",
  name: "X",
  colorScheme: "TWITTER",
  gatedEntity: "account",
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
}
