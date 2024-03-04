import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformName } from "types"

const useGatherCardProps = (guildPlatform: GuildPlatform) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const getNameFromSpaceId = () => {
    return decodeURIComponent(
      guildPlatform.platformGuildData?.gatherSpaceId.split("\\")[1]
    )
  }

  return {
    name: getNameFromSpaceId(),
    type: "GATHER_TOWN" as PlatformName,
    image: (
      <Circle size={10} bgColor={bgColor} overflow="hidden">
        <Img src={platforms.GATHER_TOWN.imageUrl} boxSize={10} color="white" />
      </Circle>
    ),
  }
}

export default useGatherCardProps
