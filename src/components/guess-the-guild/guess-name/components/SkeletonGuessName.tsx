import { Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react"

const SkeletonGuessName = () => (
  <VStack w="100%" spacing={3}>
    <SkeletonCircle size="100px" mb="3" />
    <Skeleton height="40px" w="100%" rounded="lg"></Skeleton>
    <Skeleton height="40px" w="100%" rounded="lg"></Skeleton>
    <Skeleton height="40px" w="100%" rounded="lg"></Skeleton>
    <Skeleton height="40px" w="100%" rounded="lg"></Skeleton>
  </VStack>
)

export default SkeletonGuessName
