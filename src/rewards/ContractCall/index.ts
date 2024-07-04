import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import Photo from "static/icons/photo.svg"

export default {
  icon: Photo,
  imageUrl: null,
  name: "NFT",
  colorScheme: "cyan",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} satisfies RewardData
