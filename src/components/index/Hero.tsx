import {
  Box,
  Fade,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Player } from "@lottiefiles/react-lottie-player"
import useDCAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuthWithCallback"
import useScrollEffect from "hooks/useScrollEffect"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import { ArrowRight, ArrowSquareIn, CaretDown, CaretRight } from "phosphor-react"
import { useMemo, useRef, useState } from "react"
import LandingButton from "./LandingButton"

const Hero = (): JSX.Element => {
  const router = useRouter()
  const lottiePlayer = useRef(null)
  const logoSize = useBreakpointValue({ base: 64, md: 80, lg: 112 })
  const { callbackWithDCAuth, isAuthenticating, authorization } =
    useDCAuthWithCallback("guilds", () => router.push("/create-guild/discord"))
  const [showScrollIcon, setShowScrollIcon] = useState(true)
  useScrollEffect(
    () => {
      setShowScrollIcon(false)
    },
    [],
    { once: true, capture: true }
  )

  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!authorization ? ArrowSquareIn : CaretRight)),
    [authorization]
  )

  return (
    <Box as="section" zIndex={-1} sx={{ transformStyle: "preserve-3d" }}>
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
      <Flex
        position="relative"
        direction="column"
        alignItems="center"
        justifyContent="center"
        mx="auto"
        px={6}
        w="full"
        maxW={{
          base: "340px",
          md: "lg",
          lg: "container.sm",
        }}
        height="100vh"
      >
        <Box
          onMouseEnter={() => {
            lottiePlayer.current?.setPlayerDirection(-1)
            lottiePlayer.current?.play()
          }}
          onMouseLeave={() => {
            lottiePlayer.current?.setPlayerDirection(1)
            lottiePlayer.current?.play()
          }}
        >
          <Player
            ref={lottiePlayer}
            autoplay
            keepLastFrame
            speed={1}
            src="/logo_lottie.json"
            style={{
              marginBottom: 24,
              height: logoSize,
              width: logoSize,
            }}
          />
        </Box>
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
          Automated membership management for the platforms your community already
          uses.
        </Text>

        <Stack
          direction={{ base: "column", sm: "row" }}
          spacing={{ base: 2, md: 3 }}
          w={{ base: "full", sm: "unset" }}
          mb={3}
        >
          <LandingButton
            w={{ base: "full", sm: "unset" }}
            colorScheme="DISCORD"
            onClick={callbackWithDCAuth}
            isLoading={isAuthenticating}
            loadingText={"Check the popup window"}
            rightIcon={<DynamicCtaIcon />}
          >
            Add to Discord
          </LandingButton>
          <Link passHref href="/explorer">
            <LandingButton
              as="a"
              w={{ base: "full", sm: "unset" }}
              colorScheme="solid-gray"
              rightIcon={<ArrowRight />}
              fontWeight="bold"
            >
              Explore Guilds
            </LandingButton>
          </Link>
        </Stack>

        <Text
          color="gray.450"
          fontFamily="display"
          fontWeight="bold"
          fontSize={{ base: "xs", lg: "sm" }}
        >
          Guild creation is free and gasless
        </Text>
        <Fade in={showScrollIcon}>
          <Icon
            as={CaretDown}
            pos="absolute"
            bottom="8"
            color="gray.500"
            animation={"bounce 2s infinite 2s"}
            sx={{
              "@keyframes bounce": {
                "0%,\n  100%,\n  20%,\n  50%,\n  80%": {
                  WebkitTransform: "translateY(0)",
                  msTransform: "translateY(0)",
                  transform: "translateY(0)",
                },
                "40%": {
                  WebkitTransform: "translateY(-6px)",
                  msTransform: "translateY(-6px)",
                  transform: "translateY(-6px)",
                },
                "60%": {
                  WebkitTransform: "translateY(-5px)",
                  msTransform: "translateY(-5px)",
                  transform: "translateY(-5px)",
                },
              },
            }}
          />
        </Fade>
      </Flex>
    </Box>
  )
}

export default Hero
