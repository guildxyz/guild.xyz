import { PlatformAsRewardRestrictions, RewardData } from "platforms/types"
import GithubCardMenu from "./GithubCardMenu"
import useGithubCardProps from "./useGithubCardProps"
import { GithubLogo } from "phosphor-react"
import dynamicComponents from "./DynamicComponents"

export default {
  icon: GithubLogo,
  imageUrl: "/platforms/github.png",
  name: "GitHub",
  colorScheme: "GITHUB",
  gatedEntity: "repo",
  cardPropsHook: useGithubCardProps,
  cardMenuComponent: GithubCardMenu,
  asRewardRestriction: PlatformAsRewardRestrictions.SINGLE_ROLE,
  isPlatform: true,
  ...dynamicComponents,
} as const satisfies RewardData
