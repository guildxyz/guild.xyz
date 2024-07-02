import { Star } from "phosphor-react"
import {
  CardSettingsComponent,
  PlatformAsRewardRestrictions,
  RewardData,
} from "rewards/types"
import usePointsCardProps from "./usePointsCardProps"
import dynamic from "next/dynamic"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"

export default {
  icon: Star,
  name: "Points",
  colorScheme: "gray",
  gatedEntity: "",
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
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
} as const satisfies RewardData
