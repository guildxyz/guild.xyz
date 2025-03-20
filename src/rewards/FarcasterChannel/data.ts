import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const farcasterChannelData = {
  imageUrl: "/requirementLogos/farcaster.png",
  name: "Farcaster channel",
  colorScheme: "FARCASTER",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE, // TODO: do we need to support multiple roles?
} satisfies RewardData
