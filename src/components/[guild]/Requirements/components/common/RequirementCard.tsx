import {
  Box,
  Circle,
  Img,
  SimpleGrid,
  SkeletonCircle,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  loading?: boolean
  image: string | JSX.Element
  footer?: JSX.Element
}

const RequirementCard = ({
  loading,
  image,
  footer,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
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
              colorMode === "light" ? "blackAlpha.100" : "blackAlpha.300"
            }
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            {typeof image === "string" ? (
              <Img src={image} maxWidth={"var(--chakra-space-11)"} />
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

export default RequirementCard
