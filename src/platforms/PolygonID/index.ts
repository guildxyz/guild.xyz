import { Key } from "phosphor-react"
import usePolygonIDCardProps from "./usePolygonIDCardProps"
import PolygonIDCardButton from "./PolygonIDCardButton"
import PolygonIDCardMenu from "./PolygonIDCardMenu"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import dynamicComponents from "./DynamicComponents"

export default {
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
} as const satisfies RewardData
