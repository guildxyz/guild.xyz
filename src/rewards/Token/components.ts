import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import ClaimTokenButton from "./ClaimTokenButton"
import useTokenCardProps from "./hooks/useTokenCardProps"

export default {
  cardPropsHook: useTokenCardProps,
  cardButton: ClaimTokenButton,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/AddTokenPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RoleCardComponent: dynamic(() => import("rewards/components/TokenReward"), {
    ssr: false,
  }),
} satisfies RewardComponentsData
