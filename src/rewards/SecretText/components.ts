import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import SecretTextCardMenu from "./SecretTextCardMenu"
import TextCardButton from "./TextCardButton"

export default {
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
  SmallRewardPreview: dynamic(() => import("rewards/components/TextReward"), {
    ssr: false,
  }),
} satisfies RewardComponentsData
