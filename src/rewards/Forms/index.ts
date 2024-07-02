import { PencilSimpleLine } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import useFormCardProps from "./useFormCardProps"
import FormCardLinkButton from "./FormCardLinkButton"
import FormCardMenu from "./FormCardMenu"
import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"

export default {
  icon: PencilSimpleLine,
  name: "Form",
  colorScheme: "primary",
  gatedEntity: "",
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  cardPropsHook: useFormCardProps,
  cardButton: FormCardLinkButton,
  cardMenuComponent: FormCardMenu,
  RoleCardComponent: dynamic(() => import("rewards/components/FormReward"), {
    ssr: false,
  }),
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("rewards/components/FormPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
} as const satisfies RewardData