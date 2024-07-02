import { Key } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import useUniqueTextCardProps from "./useUniqueTextCardProps"
import TextCardButton from "rewards/SecretText/TextCardButton"
import UniqueTextCardMenu from "./UniqueTextCardMenu"
import dynamic from "next/dynamic"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"

export default {
  icon: Key,
  name: "Unique secret",
  colorScheme: "gray",
  gatedEntity: "",
  cardPropsHook: useUniqueTextCardProps,
  cardButton: TextCardButton,
  cardMenuComponent: UniqueTextCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  RewardPreview: dynamic(() => import("rewards/components/UniqueTextPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("rewards/components/TextReward"), {
    ssr: false,
  }),
} as const satisfies RewardData
