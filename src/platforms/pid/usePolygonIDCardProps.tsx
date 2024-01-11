import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { PlatformName } from "types"

const usePolygonIDCardProps = () => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  return {
    name: "PolygonID proofs",
    type: "POLYGON_ID" as PlatformName,
    image: (
      <Circle size={10} bgColor={bgColor}>
        <Img src={platforms.POLYGON_ID.imageUrl} boxSize={10} color="white" />
      </Circle>
    ),
    info: "Onchain & zero-knowledge",
  }
}

export default usePolygonIDCardProps
