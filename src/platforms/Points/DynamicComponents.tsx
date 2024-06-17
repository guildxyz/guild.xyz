import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import RewardPreview from "platforms/components/RewardPreview"
import { CardSettingsComponent } from "platforms/types"

const dynamicComponents = {
  cardSettingsComponent: dynamic(
    () => import("platforms/Points/PointsCardSettings"),
    {
      ssr: false,
      loading: () => <AddRewardPanelLoadingSpinner height={20} />,
    }
  ) as CardSettingsComponent,
  RewardPreview: dynamic(() => import("platforms/components/PointsPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
  }),
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
  RoleCardComponent: dynamic(() => import("platforms/components/PointsReward"), {
    ssr: false,
  }),
}

export default dynamicComponents
