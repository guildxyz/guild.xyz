import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import Token from "static/icons/token.svg"

export default {
  icon: Token,
  imageUrl: null,
  name: "Token",
  colorScheme: "gold",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} satisfies RewardData
