import dynamic from "next/dynamic"
import { DiscordLogo } from "phosphor-react"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import DiscordCardMenu from "./DiscordCardMenu"
import DiscordCardSettings from "./DiscordCardSettings"
import useDiscordCardProps from "./useDiscordCardProps"

export default {
  cardPropsHook: useDiscordCardProps,
  cardSettingsComponent: DiscordCardSettings,
  cardMenuComponent: DiscordCardMenu,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddDiscordPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("rewards/components/DiscordPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
} satisfies RewardComponentsData
