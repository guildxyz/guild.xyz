import { Key } from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"
import TextCardButton from "platforms/SecretText/TextCardButton"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
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
  RewardPreview: dynamic(() => import("platforms/components/UniqueTextPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("platforms/components/TextReward"), {
    ssr: false,
  }),
} as const satisfies RewardData
