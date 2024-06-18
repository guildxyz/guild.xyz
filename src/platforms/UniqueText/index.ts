import { Key } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useUniqueTextCardProps from "./useUniqueTextCardProps"
import TextCardButton from "platforms/SecretText/TextCardButton"
import UniqueTextCardMenu from "./UniqueTextCardMenu"
import dynamic from "next/dynamic"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"

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
