import { EnvelopeSimple } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"

export default {
  icon: EnvelopeSimple,
  name: "Email",
  colorScheme: "blue",
  gatedEntity: "email",
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} as const satisfies RewardData
