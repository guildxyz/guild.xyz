import {
  Container,
  Flex,
  GridItem,
  Icon,
  Img,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import Head from "next/head"
import {
  CircleWavy,
  DiscordLogo,
  FilePdf,
  GithubLogo,
  TwitterLogo,
} from "phosphor-react"
import ZgenLogo from "static/zgen-logo.svg"

const Page = (): JSX.Element => (
  <>
    <Head>
      <title>Guild Developer Meetup 2022</title>
      <meta name="og:title" content="Guild Developer Meetup 2022" />
      <link rel="shortcut icon" href="/guild-icon.png" />
    </Head>
    <Container
      maxW="container.md"
      as="main"
      py={{ base: 8, md: 16 }}
      bgColor="gray.800"
      h="100vh"
    >
      <SimpleGrid columns={2} gap={{ base: 1, md: 4 }} mb={16}>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Flex alignItems="center" justifyContent={{ base: "center", md: "end" }}>
            <Text
              as="span"
              fontFamily="display"
              fontWeight="black"
              fontSize={{ base: "8xl", md: "9xl" }}
              textShadow="4px 4px 0 #515151, 8px 8px 0 #363636"
              lineHeight="100%"
            >
              Guild
            </Text>
          </Flex>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Flex alignItems="center" justifyContent={{ base: "center", md: "start" }}>
            <Text
              position="relative"
              top={2.5}
              as="span"
              fontFamily="display"
              fontWeight="black"
              fontSize={{ base: "5xl", md: "6xl" }}
              textShadow="4px 4px 0 #515151, 8px 8px 0 #363636"
              lineHeight="95%"
              textAlign={{ base: "center", md: "left" }}
            >
              Developer
              <br /> Meetup '22
            </Text>
          </Flex>
        </GridItem>
      </SimpleGrid>

      <SimpleGrid columns={2}>
        <GridItem colSpan={{ base: 2, md: 1 }} order={{ base: 2, md: 1 }}>
          <Flex alignItems="center" h="full">
            <Stack
              px={{ base: 8, md: 12 }}
              py={12}
              bgColor="whiteAlpha.50"
              w="full"
              spacing={4}
            >
              <LinkButton
                href="/lego/GuildCastleAssembly.pdf"
                rightIcon={<Icon as={FilePdf} />}
                w="full"
                justifyContent="space-between"
              >
                LEGO instructions
              </LinkButton>

              <LinkButton
                href="https://app.poap.xyz/claim-websites/z3vpbgqtzgv2zwxvcgvylw1lzxr1cc0ymdiy"
                colorScheme="POAP"
                rightIcon={<Icon as={CircleWavy} />}
                w="full"
                justifyContent="space-between"
              >
                POAP for participants
              </LinkButton>

              <LinkButton
                href="https://www.craft.do/s/5C1a911IJHTGT7"
                colorScheme="indigo"
                rightIcon={<Icon as={ZgenLogo} />}
                w="full"
                justifyContent="space-between"
              >
                Join our team
              </LinkButton>

              <LinkButton
                href="https://github.com/agoraxyz/guild.xyz"
                colorScheme="white"
                rightIcon={<Icon as={GithubLogo} />}
                w="full"
                justifyContent="space-between"
              >
                Check out our GitHub
              </LinkButton>

              <LinkButton
                href="https://twitter.com/guildxyz"
                colorScheme="TWITTER"
                rightIcon={<Icon as={TwitterLogo} />}
                w="full"
                justifyContent="space-between"
              >
                Tweet us on Twitter
              </LinkButton>

              <LinkButton
                href="https://discord.gg/guildxyz"
                colorScheme="DISCORD"
                rightIcon={<Icon as={DiscordLogo} />}
                w="full"
                justifyContent="space-between"
              >
                Let's chat on Discord
              </LinkButton>
            </Stack>
          </Flex>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }} order={{ base: 1, md: 2 }}>
          <Img
            position="relative"
            left={{ base: 0, md: -20 }}
            bottom={{ base: -8, md: 1 }}
            mx="auto"
            maxW={{ base: "80%", md: "calc(100% + var(--chakra-space-20))" }}
            src="/lego/guild-castle-big.png"
            alt="Guild Castle"
          />
        </GridItem>
      </SimpleGrid>
    </Container>
  </>
)

export default Page
