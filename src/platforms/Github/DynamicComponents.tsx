import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import RewardPreview from "platforms/components/RewardPreview"

const dynamicComponents = {
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGithubPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/GitHubPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
  }),
}

export default dynamicComponents
