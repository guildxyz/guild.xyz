import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import Box from "static/icons/box.svg"
import SecretTextCardMenu from "./SecretTextCardMenu"
import TextCardButton from "./TextCardButton"
import useSecretTextCardProps from "./useSecretTextCardProps"

export default {
  icon: Box,
  imageUrl: "/platforms/text.png",
  name: "Secret",
  colorScheme: "gray",
  gatedEntity: "",
  cardPropsHook: useSecretTextCardProps,
  cardButton: TextCardButton,
  cardMenuComponent: SecretTextCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddSecretTextPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("rewards/components/SecretTextPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("rewards/components/TextReward"), {
    ssr: false,
  }),
} as const satisfies RewardData
