import { Star } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"
import {
  CardSettingsComponent,
  PlatformAsRewardRestrictions,
  RewardData,
} from "platforms/types"
import usePointsCardProps from "./usePointsCardProps"

export default {
  icon: Star,
  name: "Points",
  colorScheme: "gray",
  gatedEntity: "",
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
  cardPropsHook: usePointsCardProps,
  cardSettingsComponent: dynamic(
    () => import("platforms/Points/PointsCardSettings"),
    {
      ssr: false,
      loading: () => <AddRewardPanelLoadingSpinner height={20} />,
    }
  ) as CardSettingsComponent,
  RewardPreview: dynamic(() => import("platforms/components/PointsPreview"), {
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
  RoleCardComponent: dynamic(() => import("platforms/components/PointsReward"), {
    ssr: false,
  }),
} as const satisfies RewardData
