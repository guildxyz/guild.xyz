import { Key } from "@phosphor-icons/react/Key"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const uniqueTextData = {
  icon: Key,
  name: "Unique secret",
  colorScheme: "gray",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} as const satisfies RewardData
