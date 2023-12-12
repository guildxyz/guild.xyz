import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformName } from "types"

const usePolygonIdCardProps = (guildPlatform: GuildPlatform) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const platformGuildData = guildPlatform.platformGuildData

  return {
    name: "PolygonID",
    type: "POLYGON_ID" as PlatformName,
    image: platformGuildData?.imageUrl ?? (
      <Circle size={10} bgColor={bgColor}>
        <Img src={platforms.POLYGON_ID.imageUrl} boxSize={10} color="white" />
      </Circle>
    ),
  }
}

export default usePolygonIdCardProps
