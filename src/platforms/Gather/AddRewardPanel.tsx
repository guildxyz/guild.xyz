import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"

export const AddRewardPanel = dynamic(
  () =>
    import(
      "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
    ),
  {
    ssr: false,
    loading: AddRewardPanelLoadingSpinner,
  }
)
