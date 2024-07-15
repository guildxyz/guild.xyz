import { PiEnvelopeSimple } from "react-icons/pi"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const emailData = {
  icon: PiEnvelopeSimple,
  name: "Email",
  colorScheme: "blue",
  gatedEntity: "email",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} as const satisfies RewardData
