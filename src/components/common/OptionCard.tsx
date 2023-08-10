import {
  Box,
  ChakraProps,
  Grid,
  HStack,
  Img,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"

type Props = {
  size?: "md" | "lg"
  title: string
  description?: string
  image: string | JSX.Element
} & ChakraProps

const OptionCard = ({
  size = "md",
  title,
  description,
  image,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Card p="6" {...rest}>
    <HStack spacing={4}>
      {typeof image === "string" ? (
        <Img
          src={image}
          alt={`${title} image`}
          borderRadius="full"
          boxSize={12}
          pos="relative"
        />
      ) : (
        image
      )}
      <Grid w="full">
        <Text
          as="h4"
          noOfLines={1}
          fontWeight={size === "lg" ? "extrabold" : "bold"}
          title={title}
        >
          {title}
        </Text>
        <Text colorScheme={"gray"} fontSize={size === "md" && "sm"}>
          {description}
        </Text>
      </Grid>
      <Box flex="1 0 auto">{children}</Box>
    </HStack>
  </Card>
)

const OptionSkeletonCard = () => (
  <Card px={{ base: 5, sm: 6 }} py="7">
    <HStack spacing={4}>
      <SkeletonCircle boxSize={12} minW={12} />
      <Grid w="full" gap={2.5}>
        <Skeleton w="80%" h={5} />
        <Skeleton w="25%" h={4} />
      </Grid>
      <Box flex="1 0 auto">
        <Skeleton h={10} borderRadius="xl" w={100} opacity={0.4} />
      </Box>
    </HStack>
  </Card>
)

export default OptionCard
export { OptionSkeletonCard }
