import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { RewardComponentsData } from "rewards/types"
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
} satisfies RewardComponentsData
