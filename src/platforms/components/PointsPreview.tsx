import useGuild from "components/[guild]/hooks/useGuild"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const PointsPreview = (): JSX.Element => {
  const { guildPlatforms } = useGuild()

  const guildPlatformId = useWatch({
    name: "rolePlatforms.0.guildPlatformId",
  })
  const platformGuildData = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData",
  })
  const amount = useWatch({
    name: "rolePlatforms.0.platformRoleData.points",
  })

  const { name, imageUrl } = guildPlatformId
    ? guildPlatforms.find((gp) => gp.id === guildPlatformId).platformGuildData ?? {}
    : platformGuildData ?? {}

  return (
    <PlatformPreview
      type="POINTS"
      name={`Get ${amount} ${name || "points"}`}
      image={imageUrl}
    />
  )
}

export default PointsPreview
