import { GithubLogo } from "@phosphor-icons/react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export const githubData = {
  icon: GithubLogo,
  imageUrl: "/platforms/github.png",
  name: "GitHub",
  colorScheme: "GITHUB",
  gatedEntity: "repo",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} as const satisfies RewardData
