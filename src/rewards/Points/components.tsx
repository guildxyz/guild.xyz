import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { CardSettings, RewardComponentsData } from "rewards/types"
import usePointsCardProps from "./usePointsCardProps"

export default {
  cardPropsHook: usePointsCardProps,
  cardSettingsComponent: dynamic(() => import("rewards/Points/PointsCardSettings"), {
    ssr: false,
    loading: () => <AddRewardPanelLoadingSpinner height={20} />,
  }) as CardSettings,
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
} satisfies RewardComponentsData
