import { PencilSimpleLine } from "@phosphor-icons/react/PencilSimpleLine"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const formData = {
  icon: PencilSimpleLine,
  name: "Form",
  colorScheme: "primary",
  gatedEntity: "",
  autoRewardSetup: false,
  isPlatform: false,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} as const satisfies RewardData
