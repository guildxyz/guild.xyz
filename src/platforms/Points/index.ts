import { Star } from "phosphor-react"
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import usePointsCardProps from "./usePointsCardProps"
import dynamicComponents from "./DynamicComponents"

const { RewardPreview, cardSettingsComponent, AddRewardPanel, RoleCardComponent } =
  dynamicComponents

const rewards = {
  POINTS: {
    icon: Star,
    name: "Points",
    colorScheme: "gray",
    gatedEntity: "",
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    cardPropsHook: usePointsCardProps,
    cardSettingsComponent,
    RewardPreview,
    AddRewardPanel,
    RoleCardComponent,
  },
} as const satisfies Partial<Rewards>

export default rewards
