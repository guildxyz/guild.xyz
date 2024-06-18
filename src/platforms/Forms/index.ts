import { PencilSimpleLine } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import useFormCardProps from "./useFormCardProps"
import FormCardLinkButton from "./FormCardLinkButton"
import FormCardMenu from "./FormCardMenu"
import dynamicComponents from "./DynamicComponents"

export default {
  icon: PencilSimpleLine,
  name: "Form",
  colorScheme: "primary",
  gatedEntity: "",
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  cardPropsHook: useFormCardProps,
  cardButton: FormCardLinkButton,
  cardMenuComponent: FormCardMenu,
  ...dynamicComponents,
} as const satisfies RewardData
