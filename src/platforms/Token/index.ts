import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useTokenCardProps from "./hooks/useTokenCardProps"
import ClaimTokenButton from "./ClaimTokenButton"
import Token from "static/icons/token.svg"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"

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
} as const satisfies RewardData
