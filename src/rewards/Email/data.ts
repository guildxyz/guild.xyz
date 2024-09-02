import { EnvelopeSimple } from "@phosphor-icons/react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const emailData = {
  icon: EnvelopeSimple,
  name: "Email",
  colorScheme: "blue",
  gatedEntity: "email",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
  requiredForRequirements: true,
} as const satisfies RewardData
