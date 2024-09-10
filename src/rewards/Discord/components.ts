import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import DiscordCardMenu from "./DiscordCardMenu"
import { DiscordCardWarning } from "./DiscordCardWarning"

export default {
  cardMenuComponent: DiscordCardMenu,
  cardWarningComponent: DiscordCardWarning,
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
