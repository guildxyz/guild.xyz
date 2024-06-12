import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import { ProvidedValueDisplayProps } from "requirements"

const PointsRankProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const { guildPlatform } = useGuildPlatform(requirement?.data?.guildPlatformId)
  const name = guildPlatform?.platformGuildData?.name || "points"
  return <>Rank on {name} leaderboard</>
}

export default PointsRankProvidedValue
