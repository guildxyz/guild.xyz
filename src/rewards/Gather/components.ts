import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import GatherCardButton from "./GatherCardButton"
import GatherCardMenu from "./GatherCardMenu"

export default {
  cardButton: GatherCardButton,
  cardMenuComponent: GatherCardMenu,
  SmallRewardPreview: dynamic(() => import("rewards/components/GatherReward"), {
    ssr: false,
  }),
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
} as const satisfies RewardComponentsData
