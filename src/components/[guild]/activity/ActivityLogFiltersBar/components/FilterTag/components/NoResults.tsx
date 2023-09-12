import { Center, Text } from "@chakra-ui/react"

const NoResults = (): JSX.Element => (
  <Center p={4} color="gray.500">
    <Text as="span" colorScheme="gray">
      No results
    </Text>
  </Center>
)

export default NoResults
