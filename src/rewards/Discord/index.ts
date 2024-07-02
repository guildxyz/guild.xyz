import { DiscordLogo } from "phosphor-react"
import useDiscordCardProps from "./useDiscordCardProps"
import DiscordCardSettings from "./DiscordCardSettings"
import DiscordCardMenu from "./DiscordCardMenu"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"

export default {
  icon: DiscordLogo,
  imageUrl: "/platforms/discord.png",
  name: "Discord",
  colorScheme: "DISCORD",
  gatedEntity: "server",
  cardPropsHook: useDiscordCardProps,
  cardSettingsComponent: DiscordCardSettings,
  cardMenuComponent: DiscordCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
  isPlatform: true,
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
} as const satisfies RewardData
