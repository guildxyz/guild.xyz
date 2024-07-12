import dynamic from "next/dynamic"
import { TelegramLogo } from "phosphor-react"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import TelegramCardMenu from "./TelegramCardMenu"
import useTelegramCardProps from "./useTelegramCardProps"

export default {
  cardPropsHook: useTelegramCardProps,
  cardMenuComponent: TelegramCardMenu,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTelegramPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("rewards/components/TelegramPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
} satisfies RewardComponentsData
