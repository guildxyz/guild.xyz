import dynamic from "next/dynamic"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { RewardComponentsData } from "rewards/types"
import PoapCardButton from "./PoapCardButton"
import PoapCardMenu from "./PoapCardMenu"
import usePoapCardProps from "./usePoapCardProps"

export default {
  cardPropsHook: usePoapCardProps,
  cardButton: PoapCardButton,
  cardMenuComponent: PoapCardMenu,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPoapPanel"
      ),
    {
      ssr: false,
    }
  ),
  RewardPreview: dynamic(() => import("rewards/components/PoapPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("rewards/components/PoapReward"), {
    ssr: false,
  }),
} satisfies RewardComponentsData
