import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
import { FarcasterChannelCardButton } from "./FarcasterChannelCardButton"
import { FarcasterChannelCardMenu } from "./FarcasterChannelCardMenu"

export default {
  cardButton: FarcasterChannelCardButton,
  cardMenuComponent: FarcasterChannelCardMenu,
  SmallRewardPreview: dynamic(
    () => import("rewards/components/FarcasterChannelReward"),
    {
      ssr: false,
    }
  ),
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFarcasterChannelPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
} as const satisfies RewardComponentsData
