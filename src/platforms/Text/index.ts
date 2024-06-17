import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import SecretTextCardMenu from "./SecretTextCardMenu"
import TextCardButton from "./TextCardButton"
import useSecretTextCardProps from "./useSecretTextCardProps"
import Box from "static/icons/box.svg"
import dynamicComponents from "./DynamicComponents"

const { RoleCardComponent, RewardPreview, AddRewardPanel } = dynamicComponents

const rewards = {
  TEXT: {
    icon: Box,
    name: "Secret",
    colorScheme: "gray",
    gatedEntity: "",
    cardPropsHook: useSecretTextCardProps,
    cardButton: TextCardButton,
    cardMenuComponent: SecretTextCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    RoleCardComponent,
    RewardPreview,
    AddRewardPanel,
  },
} as const satisfies Partial<Rewards>

export default rewards
