import {
  Box,
  Center,
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
          boxSize={{ base: 14 }}
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

type SkeletonProps = {
  size?: "md" | "lg"
}

const OptionSkeletonCard = ({ size = "md" }: SkeletonProps) => (
  <Card>
    <Center py={size === "lg" ? { base: 12, md: 20 } : 8} bg="blackAlpha.100">
      <SkeletonCircle pos="relative" boxSize={{ base: 20, md: 24 }} />
    </Center>
    <HStack
      px={{ base: 5, md: size === "md" && 4 }}
      py={size === "lg" ? 5 : 4}
      spacing={6}
      justifyContent="space-between"
    >
      <Grid gap={2.5}>
        <Skeleton h={4} w={120} />
        <Skeleton h={3} w={50} />
      </Grid>
      <Skeleton h={10} borderRadius="xl" w={100} opacity={0.4} />
    </HStack>
  </Card>
)

export default OptionCard
export { OptionSkeletonCard }
