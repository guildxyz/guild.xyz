import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import rewards, { CardPropsHook } from "rewards"

const usePolygonIDCardProps: CardPropsHook = () => {
  const bgColor = useColorModeValue("gray.700", "gray.600")
  const rolePlatform = useRolePlatform()

  return {
    name: "PolygonID proofs",
    type: "POLYGON_ID",
    image: (
      <Circle size={10} bgColor={bgColor}>
        <Img src={rewards.POLYGON_ID.imageUrl} boxSize={10} color="white" />
      </Circle>
    ),
    info: !rolePlatform ? "Onchain & zero-knowledge" : undefined,
  }
}

export default usePolygonIDCardProps
