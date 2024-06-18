import { Star } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import usePointsCardProps from "./usePointsCardProps"
import dynamicComponents from "./DynamicComponents"

export default {
  icon: Star,
  name: "Points",
  colorScheme: "gray",
  gatedEntity: "",
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
  cardPropsHook: usePointsCardProps,
  ...dynamicComponents,
} as const satisfies RewardData
