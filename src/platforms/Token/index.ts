import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import Token from "static/icons/token.svg"
import ClaimTokenButton from "./ClaimTokenButton"
import useTokenCardProps from "./hooks/useTokenCardProps"

export default {
  icon: Token,
  name: "Token",
  gatedEntity: "",
  colorScheme: "gold",
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
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
  RewardPreview: dynamic(() => import("platforms/components/TokenPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("platforms/components/TokenReward"), {
    ssr: false,
  }),
} as const satisfies RewardData
