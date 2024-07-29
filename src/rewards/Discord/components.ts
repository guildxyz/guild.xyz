import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
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
} satisfies RewardComponentsData
