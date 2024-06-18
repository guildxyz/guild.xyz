import dynamic from "next/dynamic"
import RewardPreview from "platforms/components/RewardPreview"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"

const dynamicComponents = {
  RoleCardComponent: dynamic(() => import("platforms/components/GatherReward"), {
    ssr: false,
  }),
  RewardPreview: dynamic(() => import("platforms/components/GatherPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
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
}

export default dynamicComponents
