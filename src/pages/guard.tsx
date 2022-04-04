import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Img,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import Head from "next/head"

const META_TITLE = "Guild Guard - Protect your community"
const META_DESCRIPTION =
  "Guild Guard provides full protection against Discord scams. No more bots spam."

const Page = (): JSX.Element => {
  const buttonSize = useBreakpointValue({ base: "md", md: "lg", lg: "xl" })
  const subTitle = useBreakpointValue({
    base: (
      <>
        Guild Guard provides full protection against Discord scams. <br />
        No more bots spam.
      </>
    ),
    md: (
      <>
        Guild Guard provides full protection against <br />
        Discord scams. No more bots spam.
      </>
    ),
  })

  return (
    <>
      <Head>
        <title>{META_TITLE}</title>
        <meta property="og:title" content={META_TITLE} />

        <meta name="description" content={META_DESCRIPTION} />
        <meta property="og:description" content={META_DESCRIPTION} />
      </Head>
      <Flex
        position="relative"
        bgColor="gray.800"
        height="100vh"
        display="flex"
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          position="absolute"
          inset={0}
          bgImage="url('/guildGuard/bg.svg')"
          bgSize="cover"
          bgPosition="top 1rem center"
          bgRepeat="no-repeat"
          opacity={0.1}
        />
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800), transparent)"
          opacity={0.8}
        />
        <HStack
          position="absolute"
          top={{ base: 4, lg: 8 }}
          left={{ base: 4, lg: 8 }}
          spacing={{ base: 2, md: 4 }}
          alignItems="end"
        >
          <Img
            src="guildLogos/logo.svg"
            alt="Guild Guard"
            boxSize={{ base: 8, md: 10, lg: 14 }}
          />
          <Heading
            as="h1"
            fontFamily="display"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            lineHeight="100%"
          >
            Guild
          </Heading>
        </HStack>

        <Flex position="relative" direction="column" alignItems="center" px={8}>
          <HStack spacing={{ base: 4, lg: 8 }} mb={{ base: 6, md: 10 }}>
            <Img
              mt={{ base: 1, lg: 4 }}
              src="guildLogos/logo.svg"
              alt="Guild Guard"
              boxSize={{ base: 14, md: 20, lg: 36 }}
            />
            <Heading
              as="h2"
              fontFamily="display"
              fontSize={{ base: "4xl", md: "5xl", lg: "8xl" }}
              lineHeight="85%"
            >
              Protect your <br />
              community
            </Heading>
          </HStack>
          <Text
            mb={{ base: 12, md: 16 }}
            maxW="container.lg"
            color="gray.400"
            fontSize={{ base: "lg", md: "2xl", lg: "4xl" }}
            fontWeight="semibold"
            textAlign="center"
            lineHeight={{ base: "125%", md: "100%" }}
          >
            {subTitle}
          </Text>

          <SimpleGrid width="max-content" columns={2} gap={2} mb={3}>
            <Button colorScheme="DISCORD" size={buttonSize}>
              Add to Discord
            </Button>
            <Button colorScheme="solid-gray" size={buttonSize}>
              Learn more
            </Button>
          </SimpleGrid>

          <Text
            color="gray.400"
            fontWeight="semibold"
            fontSize={{ base: "xs", md: "md" }}
          >
            Combat bots with the power of Ethereum.
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

export default Page
