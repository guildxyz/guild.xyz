import { PiGoogleLogo } from "react-icons/pi"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const googleData = {
  icon: PiGoogleLogo,
  imageUrl: "/platforms/google.png",
  name: "Google Workspace",
  colorScheme: "blue",
  gatedEntity: "document",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} satisfies RewardData
