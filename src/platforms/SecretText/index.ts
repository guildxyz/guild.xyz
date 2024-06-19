import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import SecretTextCardMenu from "./SecretTextCardMenu"
import TextCardButton from "./TextCardButton"
import useSecretTextCardProps from "./useSecretTextCardProps"
import Box from "static/icons/box.svg"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "platforms/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "platforms/components/LoadingRewardPreview"

export default {
  icon: Box,
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
  RewardPreview: dynamic(() => import("platforms/components/SecretTextPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
  RoleCardComponent: dynamic(() => import("platforms/components/TextReward"), {
    ssr: false,
  }),
} as const satisfies RewardData
