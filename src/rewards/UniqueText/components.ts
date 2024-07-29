import TextCardButton from "rewards/SecretText/TextCardButton"
import { RewardComponentsData } from "rewards/types"
import UniqueTextCardMenu from "./UniqueTextCardMenu"
import useUniqueTextCardProps from "./useUniqueTextCardProps"

export default {
  cardPropsHook: useUniqueTextCardProps,
  cardButton: TextCardButton,
  cardMenuComponent: UniqueTextCardMenu,
} satisfies RewardComponentsData
