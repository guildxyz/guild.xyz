import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import RewardPreview from "platforms/components/RewardPreview"

const dynamicComponents = {
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddDiscordPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/DiscordPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
  }),
}

export default dynamicComponents
