import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import useTokenCardProps from "./hooks/useTokenCardProps"
import ClaimTokenButton from "./ClaimTokenButton"
import Token from "static/icons/token.svg"
import dynamicComponents from "./DynamicComponents"

const rewards = {
  ERC20: {
    icon: Token,
    name: "Token",
    gatedEntity: "",
    colorScheme: "gold",
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    cardPropsHook: useTokenCardProps,
    cardButton: ClaimTokenButton,
    ...dynamicComponents,
  },
} as const satisfies Partial<Rewards>

export default rewards
