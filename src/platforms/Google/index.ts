import { GoogleLogo } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useGoogleCardProps from "./useGoogleCardProps"
import GoogleCardSettings from "./GoogleCardSettings"
import GoogleCardMenu from "./GoogleCardMenu"
import GoogleCardWarning from "./GoogleCardWarning"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"

export default {
  icon: GoogleLogo,
  imageUrl: "/platforms/google.png",
  name: "Google Workspace",
  colorScheme: "blue",
  gatedEntity: "document",
  cardPropsHook: useGoogleCardProps,
  cardSettingsComponent: GoogleCardSettings,
  cardMenuComponent: GoogleCardMenu,
  cardWarningComponent: GoogleCardWarning,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  isPlatform: true,
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
  RewardPreview: dynamic(() => import("platforms/components/GooglePreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
} as const satisfies RewardData
