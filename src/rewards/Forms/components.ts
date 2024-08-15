import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import FormCardLinkButton from "./FormCardLinkButton"
import FormCardMenu from "./FormCardMenu"

export default {
  cardButton: FormCardLinkButton,
  cardMenuComponent: FormCardMenu,
  SmallRewardPreview: dynamic(() => import("rewards/components/FormReward"), {
    ssr: false,
  }),
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
} satisfies RewardComponentsData
