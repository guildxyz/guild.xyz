import dynamic from "next/dynamic"
import { GithubLogo } from "phosphor-react"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import LoadingRewardPreview from "rewards/components/LoadingRewardPreview"
import { PlatformAsRewardRestrictions, RewardData } from "rewards/types"
import GithubCardMenu from "./GithubCardMenu"
import useGithubCardProps from "./useGithubCardProps"

export default {
  cardPropsHook: useGithubCardProps,
  cardMenuComponent: GithubCardMenu,
  AddRewardPanel: dynamic(
    () =>
      import(
        "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGithubPanel"
      ),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
  RewardPreview: dynamic(() => import("rewards/components/GitHubPreview"), {
    ssr: false,
    loading: LoadingRewardPreview,
  }),
} satisfies RewardComponentsData
