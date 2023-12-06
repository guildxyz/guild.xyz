import {
  Card,
  HStack,
  SkeletonCircle,
  SkeletonText,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"

const SkeletonAssignLogos = () => {
  const bgColor = useColorModeValue("gray.100", "whiteAlpha.200")

  return (
    <VStack w="100%" spacing={3}>
      <HStack mb="3">
        <SkeletonCircle size="70px" />
        <SkeletonCircle size="70px" />
        <SkeletonCircle size="70px" />
        <SkeletonCircle size="70px" />
      </HStack>
      <Card w="100%" background={bgColor} p="5">
        <HStack w="100%">
          <SkeletonCircle size="70px" minW="70px" />
          <SkeletonText w="70%" noOfLines={2} spacing="4" skeletonHeight="2" />
        </HStack>
      </Card>
      <Card w="100%" background={bgColor} p="5">
        <HStack w="100%">
          <SkeletonCircle size="70px" minW="70px" />
          <SkeletonText w="70%" noOfLines={2} spacing="4" skeletonHeight="2" />
        </HStack>
      </Card>
      .{" "}
      <Card w="100%" background={bgColor} p="5">
        <HStack w="100%">
          <SkeletonCircle size="70px" minW="70px" />
          <SkeletonText w="70%" noOfLines={2} spacing="4" skeletonHeight="2" />
        </HStack>
      </Card>
      <Card w="100%" background={bgColor} p="5">
        <HStack w="100%">
          <SkeletonCircle size="70px" minW="70px" />
          <SkeletonText w="70%" noOfLines={2} spacing="4" skeletonHeight="2" />
        </HStack>
      </Card>
    </VStack>
  )
}

export default SkeletonAssignLogos
