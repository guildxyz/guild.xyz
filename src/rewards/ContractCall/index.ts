import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import Photo from "static/icons/photo.svg"
import ContractCallCardMenu from "./ContractCallCardMenu"
import ContractCallRewardCardButton from "./ContractCallRewardCardButton"
import useContractCallCardProps from "./useContractCallCardProps"

export default {
  icon: Photo,
  imageUrl: "/platforms/nft.png",
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
