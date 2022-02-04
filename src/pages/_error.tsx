import { Flex, Heading, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react"
import Link from "components/common/Link"
import Head from "next/head"
import { DiscordLogo } from "phosphor-react"
import NotFOundIcon from "static/avatars/58.svg"

const Error = ({ statusCode }): JSX.Element => (
  <>
    <Head>
      <title>{`${statusCode || "Client-side"} error`}</title>
    </Head>
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column"
      h="100vh"
      maxW={{ base: "full", sm: "container.sm" }}
      mx="auto"
      px={4}
      textAlign="center"
    >
      {statusCode === 404 ? (
        <Icon as={NotFOundIcon} mb={8} boxSize={24} alt="Not found" />
      ) : (
        <Image src="/guildLogos/logo.svg" mb={8} boxSize={24} alt="Guild logo" />
      )}
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
  </>
)

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
