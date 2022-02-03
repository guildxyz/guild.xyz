import { Flex, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import Link from "components/common/Link"
import { DiscordLogo } from "phosphor-react"

const Error = ({ statusCode }): JSX.Element => (
  <Flex
    alignItems="center"
    justifyContent="center"
    direction="column"
    h="100vh"
    maxW="container.sm"
    mx="auto"
    textAlign="center"
  >
    <Heading mb={4} fontFamily="display" fontSize={statusCode ? "9xl" : "6xl"}>
      {statusCode || "Client-side error"}
    </Heading>
    <VStack>
      <Text as="span" fontSize="lg" mb={8}>
        Uh-oh! Something went wrong, please contact us on our Discord server if you
        think you shouldn't see this page!
      </Text>
      <HStack>
        <Icon as={DiscordLogo} boxSize={6} />
        <Link href="https://discord.gg/bryPA3peuT" isExternal>
          Guild.xyz Discord Server
        </Link>
      </HStack>
    </VStack>
  </Flex>
)

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
