import {
  Box,
  Circle,
  HStack,
  Img,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Tag,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
import Visibility from "components/[guild]/Visibility"
import { PropsWithChildren } from "react"
import { Visibility as VisibilityType } from "types"
import { useRequirementContext } from "./RequirementContext"

export type RequirementProps = PropsWithChildren<{
  fieldRoot?: string
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
  fieldRoot,
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
        <HStack>
          <Text wordBreak="break-word">
            {requirement?.isNegated && <Tag mr="2">DON'T</Tag>}
            {children}
            {fieldRoot ? (
              <SetVisibility ml={2} entityType="requirement" fieldBase={fieldRoot} />
            ) : (
              <Visibility
                entityVisibility={requirement?.visibility ?? VisibilityType.PUBLIC}
              />
            )}
          </Text>
        </HStack>

        {footer}
      </VStack>
      {rightElement}
    </SimpleGrid>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton>Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
