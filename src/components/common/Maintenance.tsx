import { Flex, Heading, Text } from "@chakra-ui/react"

const Maintenance = (): JSX.Element => (
  <Flex
    w="full"
    h="100vh"
    bgColor="gray.800"
    alignItems="center"
    justifyContent="center"
    direction="column"
  >
    <Heading fontFamily="display" fontSize="7xl" mb={4}>
      Maintenance
    </Heading>
    <Text fontSize="lg">Please check back later!</Text>
  </Flex>
)

export default Maintenance
