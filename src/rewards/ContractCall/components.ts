import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import ContractCallCardMenu from "./ContractCallCardMenu"
import ContractCallRewardCardButton from "./ContractCallRewardCardButton"

export default {
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
  SmallRewardPreview: dynamic(
    () => import("rewards/ContractCall/ContractCallReward"),
    {
      ssr: false,
    }
  ),
} satisfies RewardComponentsData
