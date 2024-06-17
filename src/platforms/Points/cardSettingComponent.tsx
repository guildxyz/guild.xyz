import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import { CardSettingsComponent } from "platforms/types"

export const cardSettingsComponent = dynamic(
  () => import("platforms/Points/PointsCardSettings"),
  {
    ssr: false,
    loading: () => <AddRewardPanelLoadingSpinner height={20} />,
  }
) as CardSettingsComponent
