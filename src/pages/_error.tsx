import { Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react"
import IntercomProvider, { triggerChat } from "components/_app/IntercomProvider"
import Button from "components/common/Button"
import Head from "next/head"
import Link from "next/link"
import { ChatCircle, House } from "phosphor-react"
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
          ? "Please contact us on Intercom if you think you shouldn't see this page!"
          : "Uh-oh! Something went wrong, please contact us on Intercom if you think you shouldn't see this page!"}
      </Text>
      <Stack
        direction={{ base: "column", sm: "row" }}
        spacing={{ base: 2, md: 3 }}
        w="full"
        justifyContent={"center"}
      >
        <Button
          as={Link}
          href="/explorer"
          leftIcon={<House />}
          colorScheme="indigo"
          iconSpacing={3}
          size="lg"
        >
          Go to home page
        </Button>
        <Button
          leftIcon={<ChatCircle />}
          colorScheme="solid-gray"
          iconSpacing={3}
          size="lg"
          onClick={triggerChat}
        >
          Contact support
        </Button>
      </Stack>
    </Flex>
  </>
)

const PageWrapper = (props) => (
  <IntercomProvider>
    <Page {...props} />
  </IntercomProvider>
)

PageWrapper.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default PageWrapper
