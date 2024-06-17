import { PlatformAsRewardRestrictions, Rewards } from "platforms/types";
import useTokenCardProps from "./hooks/useTokenCardProps";
import ClaimTokenButton from "./ClaimTokenButton";
import Token from "static/icons/token.svg"
import { RewardPreview } from "./RewardPreview";
import { RoleCardComponent } from "./RoleCardComponent";

const rewards = {
  ERC20: {
    icon: Token,
    name: "Token",
    gatedEntity: "",
    colorScheme: "gold",
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    cardPropsHook: useTokenCardProps,
    cardButton: ClaimTokenButton,
    RewardPreview,
    RoleCardComponent
  }
} as const satisfies Partial<Rewards>

export default rewards
