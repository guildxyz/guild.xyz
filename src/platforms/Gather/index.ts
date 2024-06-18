import { Buildings } from "phosphor-react"
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import useGatherCardProps from "./useGatherCardProps"
import GatherCardButton from "./GatherCardButton"
import GatherCardMenu from "./GatherCardMenu"
import dynamicComponents from "./DynamicComponents"

const rewards = {
  GATHER_TOWN: {
    icon: Buildings,
    imageUrl: "/platforms/gather.png",
    name: "Gather",
    colorScheme: "GATHER_TOWN",
    gatedEntity: "space",
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    cardPropsHook: useGatherCardProps,
    cardButton: GatherCardButton,
    cardMenuComponent: GatherCardMenu,
    ...dynamicComponents,
  },
} as const satisfies Partial<Rewards>

export default rewards
