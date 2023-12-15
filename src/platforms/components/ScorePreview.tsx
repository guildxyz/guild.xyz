import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const ScorePreview = (): JSX.Element => {
  const platformGuildData = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData",
  })
  const amount = useWatch({
    name: "rolePlatforms.0.platformRoleData.score",
  })

  return (
    <PlatformPreview
      type="SCORE"
      name={`Get ${amount} ${platformGuildData?.name || "points"}`}
      image={platformGuildData?.imageUrl}
    />
  )
}

export default ScorePreview
