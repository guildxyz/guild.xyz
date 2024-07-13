import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const emailData = {
  icon: EnvelopeSimple,
  name: "Email",
  colorScheme: "blue",
  gatedEntity: "email",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} as const satisfies RewardData
