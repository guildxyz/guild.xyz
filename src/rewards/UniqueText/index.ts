import { Key } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import TextCardButton from "rewards/SecretText/TextCardButton"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import UniqueTextCardMenu from "./UniqueTextCardMenu"
import useUniqueTextCardProps from "./useUniqueTextCardProps"

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
