import Star from "static/icons/star.svg"
import { GuildPlatform, PlatformName } from "types"
import { useRolePlatform } from "../../components/[guild]/RolePlatforms/components/RolePlatformProvider"

const usePointsCardProps = (guildPlatform: GuildPlatform) => {
  const rolePlatform = useRolePlatform()
  const { name, imageUrl } = guildPlatform.platformGuildData

  return {
    type: "POINTS" as PlatformName,
    image: imageUrl || <Star />,
    name: `Get ${rolePlatform?.platformRoleData?.score} ${name || "points"}`,
  }
}

export default usePointsCardProps
