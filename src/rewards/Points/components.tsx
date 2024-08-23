import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import PointsCardButton from "./PointsCardButton"
import PointsCardMenu from "./PointsCardMenu"

export default {
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  SmallRewardPreview: dynamic(() => import("rewards/components/PointsReward"), {
    ssr: false,
  }),
  cardButton: PointsCardButton,
  cardMenuComponent: PointsCardMenu,
} satisfies RewardComponentsData
