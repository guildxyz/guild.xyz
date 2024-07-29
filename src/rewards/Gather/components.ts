import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import GatherCardButton from "./GatherCardButton"
import GatherCardMenu from "./GatherCardMenu"
import useGatherCardProps from "./useGatherCardProps"

export default {
  cardPropsHook: useGatherCardProps,
  cardButton: GatherCardButton,
  cardMenuComponent: GatherCardMenu,
  RoleCardComponent: dynamic(() => import("rewards/components/GatherReward"), {
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
