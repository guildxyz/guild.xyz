import { EnvelopeSimple } from "@phosphor-icons/react"
import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"

export default {
  icon: EnvelopeSimple,
  name: "Email",
  colorScheme: "blue",
  gatedEntity: "email",
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
} as const satisfies RewardData
