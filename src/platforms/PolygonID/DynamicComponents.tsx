import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import RewardPreview from "platforms/components/RewardPreview"

const dynamicComponents = {
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPolygonIDPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/PolygonIDPreview"), {
    ssr: false,
    loading: () => <RewardPreview isLoading />,
  }),
  RoleCardComponent: dynamic(() => import("platforms/components/PolygonIDReward"), {
    ssr: false,
  }),
}

export default dynamicComponents
