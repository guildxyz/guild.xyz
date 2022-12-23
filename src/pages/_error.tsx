import { Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import Head from "next/head"
import { ArrowRight, DiscordLogo } from "phosphor-react"
import NotFoundIcon from "static/avatars/58.svg"

const Page = ({ statusCode }): JSX.Element => (
  <>
    <Head>
      <title>{`Guild - ${statusCode || "Client-side"} error`}</title>
    </Head>
    <Flex
      alignItems="center"
      justifyContent="center"
      direction="column"
      minH="100vh"
      maxW={{ base: "full", sm: "530px" }}
      mx="auto"
      p={4}
      textAlign="center"
    >
      <Icon as={NotFoundIcon} boxSize={24} alt="Not found" />
      {statusCode ? (
        <Stack mt={2} mb={8} spacing={0}>
          <Heading
            as="h1"
            fontFamily="display"
            fontSize={{ base: "8xl", md: "9xl" }}
          >
            {statusCode}
          </Heading>
          {statusCode === 404 && (
            <Heading
              as="h2"
              fontFamily="display"
              fontSize={{ base: "3xl", md: "4xl" }}
            >
              Page not found
            </Heading>
          )}
        </Stack>
      ) : (
        <Heading mt={6} mb={10} fontFamily="display" as="h1" fontSize={"6xl"}>
          Client-side error
        </Heading>
      )}
      <Text fontSize="lg" mb={10} fontWeight="medium">
        {statusCode === 404
          ? "Please contact us on our Discord server if you think you shouldn't see this page!"
          : "Uh-oh! Something went wrong, please contact us on our Discord server if you think you shouldn't see this page!"}
      </Text>
      <Stack
        direction={{ base: "column", sm: "row" }}
        spacing={{ base: 2, md: 3 }}
        w={{ base: "full", sm: "unset" }}
        mb={3}
      >
        <Button
          as="a"
          href="/"
          rightIcon={<ArrowRight />}
          w={{ base: "full", sm: "unset" }}
          colorScheme="DISCORD"
          iconSpacing={3}
          size="lg"
        >
          Return to Guild
        </Button>
        <Button
          as="a"
          href="https://discord.gg/guildxyz"
          target="_blank"
          rightIcon={<DiscordLogo />}
          colorScheme="solid-gray"
          iconSpacing={3}
          size="lg"
        >
          Go to Discord
        </Button>
      </Stack>
    </Flex>
  </>
)

Page.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Page
