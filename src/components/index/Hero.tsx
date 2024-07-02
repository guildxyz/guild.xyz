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
import { DotLottiePlayer, type DotLottieCommonPlayer } from "@dotlottie/react-player"
import { ArrowRight, CaretDown } from "@phosphor-icons/react"
import useScrollEffect from "hooks/useScrollEffect"
import Link from "next/link"
import { useRef, useState } from "react"
import LandingButton from "./LandingButton"

const Hero = (): JSX.Element => {
  const lottiePlayer = useRef<DotLottieCommonPlayer>(null)
  const logoSize = useBreakpointValue({ base: 64, md: 80, lg: 112 })
  const [showScrollIcon, setShowScrollIcon] = useState(true)
  useScrollEffect(
    () => {
      setShowScrollIcon(false)
    },
    [],
    { once: true, capture: true }
  )

  return (
    <Box as="section" zIndex={-1} sx={{ transformStyle: "preserve-3d" }}>
      <Box
        position="absolute"
        inset={0}
        bgImage="url('/landing/bg.svg')"
        bgSize={{ base: "cover", lg: "calc(100% - 2.25rem) auto" }}
        bgRepeat="no-repeat"
        bgPosition="top 1.75rem center"
        opacity={0.075}
        zIndex={-1}
        sx={{
          transform: "translateZ(-1px) scale(1.5)",
        }}
        pointerEvents={"none"}
      />
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800), transparent)"
        pointerEvents={"none"}
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
            lottiePlayer.current?.setDirection(-1)
            lottiePlayer.current?.play()
          }}
          onMouseLeave={() => {
            lottiePlayer.current?.setDirection(1)
            lottiePlayer.current?.play()
          }}
        >
          <DotLottiePlayer
            ref={lottiePlayer}
            autoplay
            speed={1}
            src="/logo.lottie"
            style={{
              marginBottom: 24,
              height: logoSize,
              width: logoSize,
              color: "white",
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
          Requirements, roles, rewards
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
            as={Link}
            href="/create-guild"
            prefetch={false}
            w={{ base: "full", sm: "unset" }}
            colorScheme="DISCORD"
            rightIcon={<ArrowRight />}
          >
            Create Guild
          </LandingButton>
          <LandingButton
            as={Link}
            href="/explorer"
            w={{ base: "full", sm: "unset" }}
            colorScheme="solid-gray"
          >
            Explore Guilds
          </LandingButton>
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
