import dynamic from "next/dynamic"
import RewardPreview from "platforms/components/RewardPreview"

const dynamicComponents = {
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPoapPanel"
      ),
    {
      ssr: false,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/PoapPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
  }),
  RoleCardComponent: dynamic(() => import("platforms/components/PoapReward"), {
    ssr: false,
  }),
}

export default dynamicComponents
