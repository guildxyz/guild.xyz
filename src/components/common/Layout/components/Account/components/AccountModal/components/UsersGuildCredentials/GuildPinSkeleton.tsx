import { Circle, SkeletonCircle, useColorModeValue } from "@chakra-ui/react"

const GuildPinSkeleton = () => {
  const bgColor = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.50", "gray.800")

  return (
    <Circle
      position="relative"
      ml={-12}
      _first={{ ml: 0 }}
      bgColor={bgColor}
      size={24}
      borderWidth={2}
      borderColor={borderColor}
    >
      <SkeletonCircle size="full" />
    </Circle>
  )
}

export default GuildPinSkeleton
