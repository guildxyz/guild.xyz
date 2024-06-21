import FarcasterIcon from "platforms/components/FarcasterIcon"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"

export default {
  icon: FarcasterIcon,
  imageUrl: "/platforms/poap.png",
  name: "Farcaster",
  colorScheme: "FARCASTER",
  gatedEntity: "farcaster",
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} as const satisfies RewardData
