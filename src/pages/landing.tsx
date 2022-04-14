import { Box, Flex, Heading, HStack, Img, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import CallToAction from "components/landing/CallToAction"
import ComposableRequirements from "components/landing/ComposableRequirements"
import Discover from "components/landing/Discover"
import ExploreTrendingGuilds from "components/landing/ExploreTrendingGuilds"
import Footer from "components/landing/Footer"
import GuardAgainstPhishingAttack from "components/landing/GuardAgainstPhishingAttack"
import GuildValues from "components/landing/GuildValues"
import PlatformAgnosticCommunities from "components/landing/PlatformAgnosticCommunities"
import RealTimeQueryEngine from "components/landing/RealTimeQueryEngine"
import TokenBasedMembership from "components/landing/TokenBasedMembership"
import { GetStaticProps } from "next"
import { useRef } from "react"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: GuildBase[]
}

const Page = ({ guilds }: Props): JSX.Element => {
  const contentRef = useRef(null)

  return (
    <Box
      as="main"
      position="relative"
      bgColor="gray.800"
      h="100vh"
      justifyContent="start"
      className="custom-scrollbar"
      overflowX="hidden"
      overflowY="scroll"
      sx={{
        perspective: "2px",
        transformStyle: "preserve-3d",
        scrollBehavior: "smooth",
      }}
    >
      <Box
        position="absolute"
        inset={0}
        bgImage="url('/guildGuard/bg.svg')"
        bgSize={{ base: "cover", lg: "calc(100% - 2.25rem) auto" }}
        bgRepeat="no-repeat"
        bgPosition="top 1.75rem center"
        opacity={0.075}
        zIndex={-1}
        sx={{
          transform: "translateZ(-1px) scale(1.5)",
        }}
      />
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800), transparent)"
      />

      <Stack
        position="absolute"
        top={0}
        left={0}
        padding={{ base: 4, lg: 8 }}
        w="full"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack
          spacing={{ base: 2, md: 4 }}
          alignItems="end"
          h={{ base: 8, md: 10 }}
        >
          <Img
            src="guildLogos/logo.svg"
            alt="Guild Guard"
            boxSize={{ base: 8, md: 10 }}
          />
          <Heading
            as="h1"
            fontFamily="display"
            fontSize={{ base: "3xl", md: "4xl" }}
            lineHeight="100%"
          >
            Guild
          </Heading>
        </HStack>

        <Button
          colorScheme="solid-gray"
          px={{ base: 4, "2xl": 6 }}
          h={{ base: 12, "2xl": 14 }}
          fontFamily="display"
          fontWeight="bold"
          letterSpacing="wide"
          lineHeight="base"
        >
          Explorer
        </Button>
      </Stack>

      <Flex
        position="relative"
        direction="column"
        alignItems="center"
        justifyContent="center"
        mx="auto"
        px={8}
        w="full"
        maxW={{
          base: "full",
          md: "container.md",
          lg: "container.lg",
          "2xl": "container.xl",
        }}
        height="100vh"
      >
        <Heading
          as="h2"
          mb={4}
          fontFamily="display"
          fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }}
          lineHeight="95%"
          textAlign="center"
        >
          Build your <br />
          tokenized Guild
        </Heading>
        <Text
          mb={12}
          maxW="container.lg"
          color="gray.450"
          fontSize={{ base: "lg", lg: "2xl" }}
          fontWeight="bold"
          textAlign="center"
          lineHeight={{ base: "125%", md: "115%" }}
        >
          Automated membership management for the <br />
          platforms your community already use.
        </Text>

        <HStack spacing={{ base: 2, md: 3 }} mb={3}>
          <Button
            // onClick={onOpen}
            colorScheme="DISCORD"
            px={{ base: 4, "2xl": 6 }}
            h={{ base: 12, "2xl": 14 }}
            fontFamily="display"
            fontWeight="bold"
            letterSpacing="wide"
            lineHeight="base"
            // isLoading={isValidating || isAuthenticating}
            // loadingText={
            //   isAuthenticating ? "Check popup window" : "Loading servers"
            // }
          >
            Add to Discord
          </Button>
          <Button
            colorScheme="solid-gray"
            px={{ base: 4, "2xl": 6 }}
            h={{ base: 12, "2xl": 14 }}
            fontFamily="display"
            fontWeight="bold"
            letterSpacing="wide"
            lineHeight="base"
            onClick={() => contentRef.current?.scrollIntoView()}
          >
            See features
          </Button>
        </HStack>

        <Text
          color="gray.450"
          fontFamily="display"
          fontWeight="bold"
          fontSize={{ base: "xs", lg: "sm" }}
        >
          Guild creation is free and gasless
        </Text>
      </Flex>

      <Box ref={contentRef} />
      <PlatformAgnosticCommunities />
      <TokenBasedMembership />
      <GuardAgainstPhishingAttack />
      <RealTimeQueryEngine />
      <ComposableRequirements />
      <ExploreTrendingGuilds guilds={guilds} />
      <GuildValues />
      <Discover />
      <CallToAction />
      <Footer />
    </Box>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetcher(`/guild?sort=members`).catch((_) => [])

  return {
    props: { guilds },
    revalidate: 10,
  }
}

export default Page
