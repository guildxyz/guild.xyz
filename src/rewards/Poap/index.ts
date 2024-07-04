import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export default {
  icon: null as unknown as RewardData["icon"],
  imageUrl: "/platforms/poap.png",
  name: "POAP",
  colorScheme: "purple",
  gatedEntity: "POAP",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} satisfies RewardData
