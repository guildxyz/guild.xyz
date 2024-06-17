import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import XLogo from "static/icons/x.svg"

const rewardData = {
  TWITTER: {
    icon: XLogo,
    imageUrl: "/platforms/x.svg",
    name: "X",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
  },
  TWITTER_V1: {
    icon: XLogo,
    name: "X",
    colorScheme: "TWITTER",
    gatedEntity: "account",
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
    isPlatform: true,
  },
} as const satisfies Partial<Rewards>

export default rewardData
