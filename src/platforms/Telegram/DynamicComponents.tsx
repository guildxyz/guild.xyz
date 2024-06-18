import dynamic from "next/dynamic"
import RewardPreview from "platforms/components/RewardPreview"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"

const dynamicComponents = {
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTelegramPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/TelegramPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
  }),
}

export default dynamicComponents
