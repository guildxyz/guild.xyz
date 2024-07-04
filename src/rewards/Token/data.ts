import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import Token from "static/icons/token.svg"

export const tokenData = {
  icon: Token,
  name: "Token",
  colorScheme: "gold",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} as const satisfies RewardData
