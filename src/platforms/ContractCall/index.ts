import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
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
