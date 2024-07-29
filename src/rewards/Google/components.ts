import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import GoogleCardMenu from "./GoogleCardMenu"
import GoogleCardSettings from "./GoogleCardSettings"
import GoogleCardWarning from "./GoogleCardWarning"
import useGoogleCardProps from "./useGoogleCardProps"

export default {
  cardPropsHook: useGoogleCardProps,
  cardSettingsComponent: GoogleCardSettings,
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
