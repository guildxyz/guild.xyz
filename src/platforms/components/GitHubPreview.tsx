import useGateables from "hooks/useGateables"
import { useWatch } from "react-hook-form"
import { PlatformType } from "types"
import PlatformPreview from "./PlatformPreview"

const GitHubPreview = (): JSX.Element => {
  const encodedRepoId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })
  const repoId = decodeURIComponent(encodedRepoId ?? "")

  const { gateables, isLoading } = useGateables(PlatformType.GITHUB)

  const repo = gateables?.find((r) => r.platformGuildId === repoId)

  return (
    <PlatformPreview
      type="GITHUB"
      isLoading={isLoading}
      name={repo?.repositoryName}
      image={repo?.avatarUrl}
    />
  )
}

export default GitHubPreview
