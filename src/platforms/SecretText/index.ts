import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import SecretTextCardMenu from "./SecretTextCardMenu"
import TextCardButton from "./TextCardButton"
import useSecretTextCardProps from "./useSecretTextCardProps"
import Box from "static/icons/box.svg"
import dynamicComponents from "./DynamicComponents"

export default {
  icon: Box,
  name: "Secret",
  colorScheme: "gray",
  gatedEntity: "",
  cardPropsHook: useSecretTextCardProps,
  cardButton: TextCardButton,
  cardMenuComponent: SecretTextCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  ...dynamicComponents,
} as const satisfies RewardData
