import { Star } from "phosphor-react"
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import usePointsCardProps from "./usePointsCardProps"
import dynamicComponents from "./DynamicComponents"

const rewards = {
  POINTS: {
    icon: Star,
    name: "Points",
    colorScheme: "gray",
    gatedEntity: "",
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    cardPropsHook: usePointsCardProps,
    ...dynamicComponents,
  },
} as const satisfies Partial<Rewards>

export default rewards
