import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import XLogo from "static/icons/x.svg"

export default {
  icon: XLogo,
  imageUrl: null,
  name: "X",
  colorScheme: "TWITTER",
  gatedEntity: "account",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} satisfies RewardData

export const twitterReward = {
  icon: XLogo,
  imageUrl: "/platforms/x.svg",
  name: "X",
  colorScheme: "TWITTER",
  gatedEntity: "account",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} satisfies RewardData
