import { HStack, Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react"
import Card from "components/common/Card"

const AuditLogSkeleton = (): JSX.Element => (
  <>
    {[...Array(5)].map((_, i) => (
      <AuditLogActionSkeleton key={i} />
    ))}
  </>
)

const AuditLogActionSkeleton = (): JSX.Element => (
  <Card>
    <HStack spacing={4} px={{ base: 5, sm: 6 }} py={7}>
      <SkeletonCircle boxSize={8} flexShrink={0} />
      <Stack spacing={1.5} w="full">
        <Skeleton w={{ base: "60%", sm: "40%" }} h={5} />
        <Skeleton w={{ base: "40%", sm: "20%" }} h={4} />
      </Stack>
    </HStack>
  </Card>
)

export default AuditLogSkeleton
