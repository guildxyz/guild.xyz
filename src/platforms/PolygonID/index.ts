import { Key } from "phosphor-react"
import usePolygonIDCardProps from "./usePolygonIDCardProps"
import PolygonIDCardButton from "./PolygonIDCardButton"
import PolygonIDCardMenu from "./PolygonIDCardMenu"
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import dynamicComponents from "./DynamicComponents"

const rewards = {
  POLYGON_ID: {
    icon: Key,
    imageUrl: "/requirementLogos/polygonId.svg",
    name: "PolygonID",
    colorScheme: "purple",
    gatedEntity: "",
    cardPropsHook: usePolygonIDCardProps,
    cardButton: PolygonIDCardButton,
    cardMenuComponent: PolygonIDCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
    autoRewardSetup: true,
    // Until we don't have a generalized connection flow
    isPlatform: false,
    ...dynamicComponents,
  },
} as const satisfies Partial<Rewards>

export default rewards
