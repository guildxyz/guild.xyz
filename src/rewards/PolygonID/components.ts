import dynamic from "next/dynamic"
import { Key } from "phosphor-react"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import PolygonIDCardButton from "./PolygonIDCardButton"
import PolygonIDCardMenu from "./PolygonIDCardMenu"
import usePolygonIDCardProps from "./usePolygonIDCardProps"

export default {
  cardPropsHook: usePolygonIDCardProps,
  cardButton: PolygonIDCardButton,
  cardMenuComponent: PolygonIDCardMenu,
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
  RewardPreview: dynamic(() => import("rewards/components/PolygonIDPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("rewards/components/PolygonIDReward"), {
    ssr: false,
  }),
} satisfies RewardComponentsData
