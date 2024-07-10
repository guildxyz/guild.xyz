import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { RewardComponentsData } from "rewards/types"
import SecretTextCardMenu from "./SecretTextCardMenu"
import TextCardButton from "./TextCardButton"
import useSecretTextCardProps from "./useSecretTextCardProps"

export default {
  cardPropsHook: useSecretTextCardProps,
  cardButton: TextCardButton,
  cardMenuComponent: SecretTextCardMenu,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddSecretTextPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("rewards/components/SecretTextPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("rewards/components/TextReward"), {
    ssr: false,
  }),
} satisfies RewardComponentsData
