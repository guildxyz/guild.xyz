import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import { useWatch } from "react-hook-form"
import RewardPreview from "./RewardPreview"

const PointsPreview = (): JSX.Element => {
  const guildPlatformId = useWatch({
    name: "rolePlatforms.0.guildPlatformId",
  })
  const platformGuildData = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData",
  })
  const amount = useWatch({
    name: "rolePlatforms.0.platformRoleData.score",
  })

  const { guildPlatform } = useGuildPlatform(guildPlatformId)
  const { name, imageUrl } = guildPlatformId
    ? // @ts-expect-error TODO: fix this error originating from strictNullChecks
      guildPlatform.platformGuildData ?? {}
    : platformGuildData ?? {}

  return (
    <RewardPreview
      type="POINTS"
      name={`Get ${amount} ${name || "points"}`}
      image={imageUrl}
    />
  )
}

export default PointsPreview
