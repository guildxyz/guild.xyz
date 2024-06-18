import { Key } from "phosphor-react"
import usePolygonIDCardProps from "./usePolygonIDCardProps"
import PolygonIDCardButton from "./PolygonIDCardButton"
import PolygonIDCardMenu from "./PolygonIDCardMenu"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"

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
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPolygonIDPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/PolygonIDPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("platforms/components/PolygonIDReward"), {
    ssr: false,
  }),
} as const satisfies RewardData
