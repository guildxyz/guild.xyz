import Star from "static/icons/star.svg"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import { useRolePlatform } from "../../components/[guild]/RolePlatforms/components/RolePlatformProvider"

const usePointsCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const rolePlatform = useRolePlatform()
  const { name, imageUrl } = guildPlatform.platformGuildData

  return {
    type: "POINTS" as PlatformName,
    image: imageUrl || <Star />,
    // if undefined at admin setup -> "some", if saved with no value (empty string) -> 0
    name: `Get ${(rolePlatform?.platformRoleData?.score ?? "some") || 0} ${
      name || "points"
    }`,
  }
}

export default usePointsCardProps
