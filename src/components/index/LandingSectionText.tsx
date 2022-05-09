import { Text } from "@chakra-ui/react"

const LandingSectionText = ({ children }) => (
  <Text
    fontSize={{ base: "lg", lg: "xl" }}
    fontWeight="semibold"
    lineHeight="125%"
    w="full"
    colorScheme={"gray"}
  >
    {children}
  </Text>
)

export default LandingSectionText
