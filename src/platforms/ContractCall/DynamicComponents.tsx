import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import RewardPreview from "platforms/components/RewardPreview"

const dynamicComponents = {
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/ContractCallPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
  }),
  RoleCardComponent: dynamic(
    () => import("platforms/ContractCall/ContractCallReward"),
    {
      ssr: false,
    }
  ),
}

export default dynamicComponents
