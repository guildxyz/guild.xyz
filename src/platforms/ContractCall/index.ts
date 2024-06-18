import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useContractCallCardProps from "./useContractCallCardProps"
import ContractCallRewardCardButton from "./ContractCallRewardCardButton"
import ContractCallCardMenu from "./ContractCallCardMenu"
import Photo from "static/icons/photo.svg"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"

export default {
  icon: Photo,
  name: "NFT",
  colorScheme: "cyan",
  gatedEntity: "",
  cardPropsHook: useContractCallCardProps,
  cardButton: ContractCallRewardCardButton,
  cardMenuComponent: ContractCallCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("platforms/components/ContractCallPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(
    () => import("platforms/ContractCall/ContractCallReward"),
    {
      ssr: false,
    }
  ),
} as const satisfies RewardData
