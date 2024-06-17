import { EnvelopeSimple } from "phosphor-react"
import { PlatformAsRewardRestrictions, Rewards } from "platforms/types"

const rewardData = {
  EMAIL: {
    icon: EnvelopeSimple,
    name: "Email",
    colorScheme: "blue",
    gatedEntity: "email",
    isPlatform: true,
    asRewardRestriction: PlatformAsRewardRestrictions.NOT_APPLICABLE,
  }
} as const satisfies Partial<Rewards>

export default rewardData
