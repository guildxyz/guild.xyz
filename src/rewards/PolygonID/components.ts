import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import PolygonIDCardButton from "./PolygonIDCardButton"
import PolygonIDCardMenu from "./PolygonIDCardMenu"

export default {
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
  SmallRewardPreview: dynamic(() => import("rewards/components/PolygonIDReward"), {
    ssr: false,
  }),
} satisfies RewardComponentsData
