import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import WorldIDIcon from "static/icons/world-id.svg"

export const worldIDData = {
  icon: WorldIDIcon,
  imageUrl: "",
  name: "World ID",
  colorScheme: "black",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} satisfies RewardData
