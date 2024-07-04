import { GithubLogo } from "@phosphor-icons/react"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"

export default {
  icon: GithubLogo,
  imageUrl: "/platforms/github.png",
  name: "GitHub",
  colorScheme: "GITHUB",
  gatedEntity: "repo",
  autoRewardSetup: false,
  isPlatform: true,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
} satisfies RewardData
