import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import usePoapCardProps from "./usePoapCardProps"
import PoapCardButton from "./PoapCardButton"
import PoapCardMenu from "./PoapCardMenu"
import dynamic from "next/dynamic"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"

export default {
  imageUrl: "/platforms/poap.png",
  name: "POAP",
  colorScheme: "purple",
  gatedEntity: "POAP",
  cardPropsHook: usePoapCardProps,
  cardButton: PoapCardButton,
  cardMenuComponent: PoapCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
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
} as const satisfies RewardData
