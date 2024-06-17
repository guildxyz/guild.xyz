import dynamic from "next/dynamic";
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner";

export const AddRewardPanel = dynamic(
  () =>
    import(
      "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/AddTokenPanel"
    ),
  {
    ssr: false,
    loading: AddRewardPanelLoadingSpinner,
  }
)
