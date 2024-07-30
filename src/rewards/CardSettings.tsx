import dynamic from "next/dynamic"
import DiscordCardSettings from "./Discord/DiscordCardSettings/DiscordCardSettings"
import GoogleCardSettings from "./Google/GoogleCardSettings"
import { AddRewardPanelLoadingSpinner } from "./components/AddRewardPanelLoadingSpinner"
import { CardSetting, RewardComponentMap } from "./types"

export const cardSettings = {
  GOOGLE: GoogleCardSettings,
  POINTS: dynamic(() => import("rewards/Points/PointsCardSettings"), {
    ssr: false,
    loading: () => <AddRewardPanelLoadingSpinner height={20} />,
  }) as CardSetting,
  DISCORD: DiscordCardSettings,
} as const satisfies RewardComponentMap<CardSetting>
