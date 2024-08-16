import dynamic from "next/dynamic"
import TextCardButton from "rewards/SecretText/TextCardButton"
import { RewardComponentsData } from "rewards/types"
import UniqueTextCardMenu from "./UniqueTextCardMenu"

export default {
  cardButton: TextCardButton,
  cardMenuComponent: UniqueTextCardMenu,
  SmallRewardPreview: dynamic(() => import("rewards/components/TextReward"), {
    ssr: false,
  }),
} satisfies RewardComponentsData
