import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import FarcasterIcon from "static/socialIcons/farcaster.svg"

export const farcasterData = {
  icon: FarcasterIcon,
  imageUrl: "/requirementLogos/farcaster.png",
  name: "Farcaster",
  colorScheme: "FARCASTER",
  gatedEntity: "farcaster",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} satisfies RewardData
