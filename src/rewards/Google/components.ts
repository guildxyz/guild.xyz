import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import GoogleCardMenu from "./GoogleCardMenu"
import GoogleCardWarning from "./GoogleCardWarning"

export default {
  cardMenuComponent: GoogleCardMenu,
  cardWarningComponent: GoogleCardWarning,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGooglePanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
} satisfies RewardComponentsData
