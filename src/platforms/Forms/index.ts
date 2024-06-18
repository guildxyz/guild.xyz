import { PencilSimpleLine } from "phosphor-react"
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"
import useFormCardProps from "./useFormCardProps"
import FormCardLinkButton from "./FormCardLinkButton"
import FormCardMenu from "./FormCardMenu"
import { RewardPreview } from "./RewardPreview"
import { AddRewardPanel } from "./AddRewardPanel"
import { RoleCardComponent } from "./RoleCardComponent"

export default {
  FORM: {
    icon: PencilSimpleLine,
    name: "Form",
    colorScheme: "primary",
    gatedEntity: "",
    asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
    cardPropsHook: useFormCardProps,
    cardButton: FormCardLinkButton,
    cardMenuComponent: FormCardMenu,
    RewardPreview,
    AddRewardPanel,
    RoleCardComponent,
  },
} as const satisfies Partial<Rewards>
