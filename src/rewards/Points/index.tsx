import { Star } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import {
  CardSettingsComponent,
  PlatformAsRewardRestrictions,
  RewardData,
} from "rewards/types"
import usePointsCardProps from "./usePointsCardProps"

export default {
  icon: Star,
  imageUrl: "/platforms/points.png",
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
