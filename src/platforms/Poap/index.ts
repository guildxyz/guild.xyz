import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import usePoapCardProps from "./usePoapCardProps"
import PoapCardButton from "./PoapCardButton"
import PoapCardMenu from "./PoapCardMenu"
import dynamic from "next/dynamic"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"

export default {
  icon: null,
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
  RewardPreview: dynamic(() => import("platforms/components/PoapPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("platforms/components/PoapReward"), {
    ssr: false,
  }),
} as const satisfies RewardData
