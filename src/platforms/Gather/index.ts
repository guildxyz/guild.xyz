import { Buildings } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useGatherCardProps from "./useGatherCardProps"
import GatherCardButton from "./GatherCardButton"
import GatherCardMenu from "./GatherCardMenu"
import dynamic from "next/dynamic"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"

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
  RoleCardComponent: dynamic(() => import("platforms/components/GatherReward"), {
    ssr: false,
  }),
  RewardPreview: dynamic(() => import("platforms/components/GatherPreview"), {
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
