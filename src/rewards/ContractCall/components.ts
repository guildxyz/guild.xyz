import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { RewardComponentsData } from "rewards/types"
import ContractCallCardMenu from "./ContractCallCardMenu"
import ContractCallRewardCardButton from "./ContractCallRewardCardButton"
import useContractCallCardProps from "./useContractCallCardProps"

export default {
  cardPropsHook: useContractCallCardProps,
  cardButton: ContractCallRewardCardButton,
  cardMenuComponent: ContractCallCardMenu,
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
} satisfies RewardComponentsData
