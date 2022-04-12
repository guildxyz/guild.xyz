import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Img,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import ComposableRequirements from "components/landing/ComposableRequirements"
import ExploreTrendingGuilds from "components/landing/ExploreTrendingGuilds"
import GuardAgainstPhishingAttack from "components/landing/GuardAgainstPhishingAttack"
import PlatformAgnosticCommunities from "components/landing/PlatformAgnosticCommunities"
import RealTimeQueryEngine from "components/landing/RealTimeQueryEngine"
import TokenBasedMembership from "components/landing/TokenBasedMembership"
import { motion, useTransform, useViewportScroll } from "framer-motion"
import { GetStaticProps } from "next"
import { useRef } from "react"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

const MotionBox = motion(Box)

type Props = {
  guilds: GuildBase[]
}

const Page = ({ guilds }: Props): JSX.Element => {
  const { scrollY } = useViewportScroll()
  const y = useTransform(scrollY, [0, 1], [0, 0.25], {
    clamp: false,
  })

  const contentRef = useRef(null)

  return (
    <Flex
      position="relative"
      bgColor="gray.800"
      minH="100vh"
      display="flex"
      direction="column"
      alignItems="center"
      justifyContent="start"
    >
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        width="full"
        height="100vh"
        bgImage="url('/guildGuard/bg.svg')"
        bgSize={{ base: "cover", lg: "calc(100% - 2.25rem) auto" }}
        bgPosition="top 1.75rem center"
        bgRepeat="no-repeat"
        opacity={0.075}
        initial={{
          y: 0,
        }}
        style={{
          y,
        }}
      >
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800), transparent)"
        />
      </MotionBox>
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
          Connect wallet
        </Button>
      </Stack>

      <Flex
        position="relative"
        direction="column"
        alignItems="center"
        px={8}
        pt={{ base: "30vh", lg: "20vh" }}
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

      <Container
        ref={contentRef}
        position="relative"
        maxW="container.lg"
        px={{ base: 8, lg: 10 }}
        py={8}
      >
        <PlatformAgnosticCommunities />
        <TokenBasedMembership />
        <GuardAgainstPhishingAttack />
        <RealTimeQueryEngine />
        <ComposableRequirements />
        <ExploreTrendingGuilds guilds={guilds} />
      </Container>
    </Flex>
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
