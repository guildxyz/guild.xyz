import { TelegramLogo } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import useTelegramCardProps from "./useTelegramCardProps"
import TelegramCardMenu from "./TelegramCardMenu"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"

export default {
  icon: TelegramLogo,
  imageUrl: "/platforms/telegram.png",
  name: "Telegram",
  colorScheme: "TELEGRAM",
  gatedEntity: "group",
  cardPropsHook: useTelegramCardProps,
  cardMenuComponent: TelegramCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  isPlatform: true,
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
} as const as RewardData