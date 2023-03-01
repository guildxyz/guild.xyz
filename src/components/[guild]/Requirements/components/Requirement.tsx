import {
  Box,
  Circle,
  Img,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Tag,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { useRequirementContext } from "./RequirementContext"

export type RequirementProps = PropsWithChildren<{
  isImageLoading?: boolean
  image?: string | JSX.Element
  withImgBg?: boolean
  footer?: JSX.Element
  rightElement?: JSX.Element
}>

const Requirement = ({
  isImageLoading,
  image,
  footer,
  withImgBg = true,
  rightElement,
  children,
}: RequirementProps): JSX.Element => {
  const { colorMode } = useColorMode()
  const requirement = useRequirementContext()

  return (
    <SimpleGrid
      spacing={4}
      w="full"
      py={2}
      templateColumns={`auto 1fr ${rightElement ? "auto" : ""}`}
      alignItems="center"
    >
      <Box mt="3px" alignSelf={"start"}>
        <SkeletonCircle
          minW={"var(--chakra-space-11)"}
          boxSize={"var(--chakra-space-11)"}
          isLoaded={!isImageLoading}
        >
          <Circle
            size={"var(--chakra-space-11)"}
            backgroundColor={
              withImgBg &&
              (colorMode === "light" ? "blackAlpha.100" : "blackAlpha.300")
            }
            alignItems="center"
            justifyContent="center"
            overflow={withImgBg ? "hidden" : undefined}
          >
            {typeof image === "string" ? (
              image.endsWith(".mp4") ? (
                <video
                  src={image}
                  width={"var(--chakra-space-11)"}
                  height={"var(--chakra-space-11)"}
                  muted
                  autoPlay
                  loop
                />
              ) : (
                <Img
                  src={image}
                  maxWidth={"var(--chakra-space-11)"}
                  maxHeight={"var(--chakra-space-11)"}
                />
              )
            ) : (
              image
            )}
          </Circle>
        </SkeletonCircle>
      </Box>
      <VStack alignItems={"flex-start"} alignSelf="center">
        <Text wordBreak="break-word">
          {requirement?.isNegated && <Tag mr="2">DON'T</Tag>}
          {children}
        </Text>

        {footer}
      </VStack>
      {rightElement}
    </SimpleGrid>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton as="span">Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
