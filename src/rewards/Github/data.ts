import { PiGithubLogo } from "react-icons/pi"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const githubData = {
  icon: PiGithubLogo,
  imageUrl: "/platforms/github.png",
  name: "GitHub",
  colorScheme: "GITHUB",
  gatedEntity: "repo",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} as const satisfies RewardData
