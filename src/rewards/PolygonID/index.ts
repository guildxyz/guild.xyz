import { Key } from "@phosphor-icons/react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export default {
  icon: Key,
  imageUrl: "/requirementLogos/polygonId.svg",
  name: "PolygonID",
  colorScheme: "purple",
  gatedEntity: "",
  autoRewardSetup: true,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
} satisfies RewardData
