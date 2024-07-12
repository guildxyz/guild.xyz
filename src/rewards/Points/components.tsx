import dynamic from "next/dynamic"
import { Star } from "phosphor-react"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import {
  CardSettingsComponent,
  PlatformAsRewardRestrictions,
  RewardData,
} from "rewards/types"
import usePointsCardProps from "./usePointsCardProps"

export default {
  cardPropsHook: usePointsCardProps,
  cardSettingsComponent: dynamic(() => import("rewards/Points/PointsCardSettings"), {
    ssr: false,
    loading: () => <AddRewardPanelLoadingSpinner height={20} />,
  }) as CardSettingsComponent,
  RewardPreview: dynamic(() => import("rewards/components/PointsPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RoleCardComponent: dynamic(() => import("rewards/components/PointsReward"), {
    ssr: false,
  }),
} satisfies RewardComponentsData
