import { GoogleLogo } from "phosphor-react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const googleData = {
  icon: GoogleLogo,
  imageUrl: "/platforms/google.png",
  name: "Google Workspace",
  colorScheme: "blue",
  gatedEntity: "document",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} satisfies RewardData
