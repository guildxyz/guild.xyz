import useSetRoleImageAndNameFromPlatformData from "components/[guild]/AddRewardButton/hooks/useSetRoleImageAndNameFromPlatformData"
import useGateables from "hooks/useGateables"
import { useWatch } from "react-hook-form"
import { PlatformType } from "types"
import RewardPreview from "./RewardPreview"

const GitHubPreview = (): JSX.Element => {
  const encodedRepoId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })
  const repoId = decodeURIComponent(encodedRepoId ?? "")

  const { gateables, isLoading } = useGateables(PlatformType.GITHUB)

  const repo = gateables?.find((r) => r.platformGuildId === repoId)

  useSetRoleImageAndNameFromPlatformData(repo?.avatarUrl, repo?.repositoryName)

  return (
    <RewardPreview
      type="GITHUB"
      isLoading={isLoading}
      name={repo?.repositoryName}
      image={repo?.avatarUrl}
    />
  )
}

export default GitHubPreview
