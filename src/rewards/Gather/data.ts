import { Buildings } from "@phosphor-icons/react/Buildings"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const gatherData = {
  icon: Buildings,
  imageUrl: "/platforms/gather.png",
  name: "Gather",
  colorScheme: "GATHER_TOWN",
  gatedEntity: "space",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
} as const satisfies RewardData
