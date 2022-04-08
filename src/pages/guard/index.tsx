import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Img,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { fetchUsersServers } from "components/create-guild/PickRolePlatform/components/Discord/Discord"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import processDiscordError from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/utils/processDiscordError"
import { motion, useTransform, useViewportScroll } from "framer-motion"
import useToast from "hooks/useToast"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useSWR from "swr"

const META_TITLE = "Guild Guard - Protect your community"
const META_DESCRIPTION =
  "Guild Guard provides full protection against Discord scams. No more bots spam."

const MotionBox = motion(Box)

const Page = (): JSX.Element => {
  const { scrollY } = useViewportScroll()
  const y = useTransform(scrollY, [0, 1], [0, 0.25], {
    clamp: false,
  })

  const toast = useToast()
  const {
    fetcherWithDCAuth,
    isAuthenticating,
    onOpen,
    error: dcAuthError,
  } = useDCAuth("guilds")
  const { data: servers, isValidating } = useSWR(
    fetcherWithDCAuth ? "usersServers" : null,
    () => fetchUsersServers("", fetcherWithDCAuth)
  )

  useEffect(() => {
    if (dcAuthError) {
      const { title, description } = processDiscordError(dcAuthError)
      toast({ status: "error", title, description })
    }
  }, [dcAuthError])

  const router = useRouter()

  useEffect(() => {
    if (Array.isArray(servers)) {
      router.push("/guard/setup")
    }
  }, [servers])

  const subTitle = useBreakpointValue({
    base: (
      <>
        Guild Guard provides full protection <br />
        against Discord scams. <br />
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
        <link rel="icon" href="guard_favicon.ico" />
        <meta property="og:title" content={META_TITLE} />

        <meta name="description" content={META_DESCRIPTION} />
        <meta property="og:description" content={META_DESCRIPTION} />
      </Head>
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

        <Flex
          position="relative"
          direction="column"
          alignItems="center"
          px={8}
          pt={{ base: 36, lg: "20vh" }}
          w="full"
          maxW={{
            base: "full",
            md: "container.md",
            lg: "container.lg",
            "2xl": "container.xl",
          }}
        >
          <HStack spacing={4} mb={8}>
            <Img
              mt={{ base: 1, lg: 4 }}
              src="guildGuard/robot.svg"
              alt="Guild Guard"
              boxSize={{ base: 14, md: 20, lg: 32 }}
            />
            <Heading
              as="h2"
              fontFamily="display"
              fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }}
              lineHeight="95%"
            >
              Protect your <br />
              community
            </Heading>
          </HStack>
          <Text
            mb={12}
            maxW="container.lg"
            color="gray.450"
            fontSize={{ base: "lg", lg: "2xl" }}
            fontWeight="bold"
            textAlign="center"
            lineHeight={{ base: "125%", md: "115%" }}
          >
            {subTitle}
          </Text>

          <HStack spacing={{ base: 2, md: 3 }} mb={3}>
            <Button
              onClick={onOpen}
              colorScheme="DISCORD"
              px={{ base: 4, "2xl": 6 }}
              h={{ base: 12, "2xl": 14 }}
              fontFamily="display"
              fontWeight="bold"
              letterSpacing="wide"
              lineHeight="base"
              isLoading={isValidating || isAuthenticating}
              loadingText={
                isAuthenticating ? "Check popup window" : "Loading servers"
              }
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
              disabled
            >
              Learn more - soon
            </Button>
          </HStack>

          <Text
            color="gray.450"
            fontFamily="display"
            fontWeight="bold"
            fontSize={{ base: "xs", lg: "sm" }}
          >
            Web3 CAPTCHA to combat bots with the power of Ethereum.
          </Text>

          <AspectRatio
            mt={{ base: 16, lg: "15vh" }}
            mb={{ base: 16, "2xl": 20 }}
            w="full"
            ratio={16 / 10}
          >
            <Card borderRadius={{ base: "2xl", md: "3xl" }}></Card>
          </AspectRatio>
        </Flex>
      </Flex>
    </>
  )
}

export default Page
