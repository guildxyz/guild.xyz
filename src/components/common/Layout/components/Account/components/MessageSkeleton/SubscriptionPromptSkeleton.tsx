import { HStack, Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react"

const SubscriptionPromptSkeleton = () => (
  <Stack spacing={0}>
    <HStack pt={4} pb={5} pl={1} spacing={4}>
      <SkeletonCircle boxSize={6} />

      <Stack spacing={0.5} w="full">
        <Skeleton h={4} w="60%" />
        <Skeleton h={3} w="50%" />
      </Stack>
    </HStack>
  </Stack>
)

export default SubscriptionPromptSkeleton
