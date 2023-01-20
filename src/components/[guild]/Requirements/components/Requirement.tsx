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
import PurchaseRequirement from "components/[guild]/Requirements/components/PurchaseRequirement"
import { PropsWithChildren } from "react"

export type RequirementProps = PropsWithChildren<{
  isImageLoading?: boolean
  image?: string | JSX.Element
  withImgBg?: boolean
  footer?: JSX.Element
  rightElement?: JSX.Element
  isNegated?: boolean
  showPurchaseBtn?: boolean
  showFooter?: boolean
  showRightElement?: boolean
}>

const Requirement = ({
  isImageLoading,
  image,
  footer,
  withImgBg = true,
  rightElement,
  isNegated = false,
  showPurchaseBtn = true,
  showFooter = true, // TODO: think about a better solution for these
  showRightElement = true, // TODO: think about a better solution for these
  children,
}: RequirementProps): JSX.Element => {
  const { colorMode } = useColorMode()

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
        <Text wordBreak="break-word">
          {isNegated && <Tag mr="2">DON'T</Tag>}
          {children}
        </Text>

        <HStack spacing={4}>
          {showPurchaseBtn && <PurchaseRequirement />}
          {showFooter && footer}
        </HStack>
      </VStack>
      {showRightElement && rightElement}
    </SimpleGrid>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton>Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
