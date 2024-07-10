import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"

const PointsRankProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const { guildPlatform } = useGuildPlatform(requirement?.data?.guildPlatformId)
  const name = guildPlatform?.platformGuildData?.name || "points"
  return <>Rank on {name} leaderboard</>
}

export default PointsRankProvidedValue
