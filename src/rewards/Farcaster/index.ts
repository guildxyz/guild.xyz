import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import FarcasterIcon from "static/socialIcons/farcaster.svg"

export default {
  icon: FarcasterIcon,
  imageUrl: "/requirementLogos/farcaster.png",
  name: "Farcaster",
  colorScheme: "FARCASTER",
  gatedEntity: "farcaster",
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} as const satisfies RewardData
