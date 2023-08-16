import {
  Circle,
  HStack,
  Icon,
  Img,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { Question } from "phosphor-react"
import platforms from "platforms/platforms"
import { PlatformName } from "types"

type Props = {
  isLoading?: boolean
  type: PlatformName
  image?: JSX.Element | string
  name?: string
}

const PlatformPreview = ({ isLoading, type, image, name }: Props) => {
  const circleBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <HStack spacing={4}>
      <SkeletonCircle boxSize={12} isLoaded={!isLoading}>
        {image ? (
          typeof image === "string" ? (
            <Img boxSize={12} src={image} alt="Reward image" borderRadius="full" />
          ) : (
            image
          )
        ) : (
          <Circle
            size={12}
            bgColor={circleBg}
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={platforms[type]?.icon ?? Question} size={6} />
          </Circle>
        )}
      </SkeletonCircle>

      <Skeleton isLoaded={!isLoading}>
        <Text as="span" fontSize="lg" fontFamily="body">
          {name ?? `${platforms[type]?.name ?? "Unknown"} reward`}
        </Text>
      </Skeleton>
    </HStack>
  )
}

export default PlatformPreview
