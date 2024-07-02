import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import useContractCallCardProps from "./useContractCallCardProps"
import ContractCallRewardCardButton from "./ContractCallRewardCardButton"
import ContractCallCardMenu from "./ContractCallCardMenu"
import Photo from "static/icons/photo.svg"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"

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
  RewardPreview: dynamic(() => import("rewards/components/ContractCallPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(
    () => import("rewards/ContractCall/ContractCallReward"),
    {
      ssr: false,
    }
  ),
} as const satisfies RewardData