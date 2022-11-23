import {
  Box,
  Circle,
  Img,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"

export type RequirementProps = PropsWithChildren<{
  loading?: boolean
  image?: string | JSX.Element
  withImgBg?: boolean
  footer?: JSX.Element
}>

const Requirement = ({
  loading,
  image,
  footer,
  withImgBg = true,
  children,
}: RequirementProps): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <SimpleGrid spacing={4} w="full" py={2} templateColumns="auto 1fr">
      <Box mt="3px">
        <SkeletonCircle
          minW={"var(--chakra-space-11)"}
          boxSize={"var(--chakra-space-11)"}
          isLoaded={!loading}
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
              <Img
                src={image}
                maxWidth={"var(--chakra-space-11)"}
                maxHeight={"var(--chakra-space-11)"}
              />
            ) : (
              image
            )}
          </Circle>
        </SkeletonCircle>
      </Box>
      <VStack alignItems={"flex-start"} alignSelf="center">
        <Text wordBreak="break-word">{children}</Text>
        {footer}
      </VStack>
    </SimpleGrid>
  )
}

export const RequirementSkeleton = () => (
  <Requirement loading={true}>
    <Skeleton>Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
