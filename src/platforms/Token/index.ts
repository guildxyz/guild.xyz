import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useTokenCardProps from "./hooks/useTokenCardProps"
import ClaimTokenButton from "./ClaimTokenButton"
import Token from "static/icons/token.svg"
import dynamicComponents from "./DynamicComponents"

export default {
  icon: Token,
  name: "Token",
  gatedEntity: "",
  colorScheme: "gold",
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  cardPropsHook: useTokenCardProps,
  cardButton: ClaimTokenButton,
  ...dynamicComponents,
} as const satisfies RewardData
