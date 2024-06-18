import { Key } from "phosphor-react"
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import useUniqueTextCardProps from "./useUniqueTextCardProps"
import TextCardButton from "platforms/SecretText/TextCardButton"
import UniqueTextCardMenu from "./UniqueTextCardMenu"
import dynamicComponents from "./DynamicComponents"

const rewards = {
  UNIQUE_TEXT: {
    icon: Key,
    name: "Unique secret",
    colorScheme: "gray",
    gatedEntity: "",
    cardPropsHook: useUniqueTextCardProps,
    cardButton: TextCardButton,
    cardMenuComponent: UniqueTextCardMenu,
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    ...dynamicComponents,
  },
} as const satisfies Partial<Rewards>

export default rewards
