import { Circle, SkeletonCircle, useColorModeValue } from "@chakra-ui/react"

const GuildPinSkeleton = () => {
  const borderAndBgColor = useColorModeValue("white", "gray.700")
  return (
    <Circle
      position="relative"
      ml={-12}
      _first={{ ml: 0 }}
      bgColor={borderAndBgColor}
      size={24}
      borderWidth={2}
      borderColor={borderAndBgColor}
    >
      <SkeletonCircle size="full" />
    </Circle>
  )
}

export default GuildPinSkeleton
