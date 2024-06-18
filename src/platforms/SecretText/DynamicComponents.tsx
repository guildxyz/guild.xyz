import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import RewardPreview from "platforms/components/RewardPreview"

const dynamicComponents = {
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddSecretTextPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/SecretTextPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
  }),
  RoleCardComponent: dynamic(() => import("platforms/components/TextReward"), {
    ssr: false,
  }),
}

export default dynamicComponents
