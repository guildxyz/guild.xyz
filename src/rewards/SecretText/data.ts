import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import Box from "static/icons/box.svg"

export const secretTextData = {
  icon: Box,
  name: "Secret",
  colorScheme: "gray",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} as const satisfies RewardData
