import { Buildings } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import GatherCardButton from "./GatherCardButton"
import GatherCardMenu from "./GatherCardMenu"
import useGatherCardProps from "./useGatherCardProps"

export default {
  icon: Buildings,
  imageUrl: "/platforms/gather.png",
  name: "Gather",
  colorScheme: "GATHER_TOWN",
  gatedEntity: "space",
  asRewardRestriction: PlatformAsRewardRestrictions.MULTIPLE_ROLES,
  cardPropsHook: useGatherCardProps,
  cardButton: GatherCardButton,
  cardMenuComponent: GatherCardMenu,
  RoleCardComponent: dynamic(() => import("rewards/components/GatherReward"), {
    ssr: false,
  }),
  RewardPreview: dynamic(() => import("rewards/components/GatherPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
} as const satisfies RewardData
