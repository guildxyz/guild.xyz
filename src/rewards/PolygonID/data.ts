import { Key } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const polygonIdData = {
  icon: Key,
  imageUrl: "/requirementLogos/polygonId.svg",
  name: "PolygonID",
  colorScheme: "purple",
  gatedEntity: "",
  autoRewardSetup: true,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
} as const satisfies RewardData
