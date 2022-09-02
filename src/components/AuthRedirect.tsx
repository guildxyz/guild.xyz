import { Center, Heading, Text } from "@chakra-ui/react"

const AuthRedirect = ({ isUnsupported = false }) => (
  <Center flexDir={"column"} p="10" textAlign={"center"} h="90vh">
    <Heading size="md" mb="3">
      {isUnsupported ? "Unsupported browser" : "You're being redirected"}
    </Heading>
    <Text>
      {isUnsupported
        ? "This browser doesn't seem to support our authentication method, please try again in your regular browser app with WalletConnect, or from desktop!"
        : "Closing the authentication window and taking you back to the site..."}
    </Text>
  </Center>
)

export default AuthRedirect
