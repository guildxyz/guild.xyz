import {
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Head from "next/head"
import Image from "next/image"
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import GuildLogo from "../GuildLogo"
import Footer from "./components/Footer"
import Header from "./components/Header"

// Use "useEffect" when rendering on the server, so we don't get warnings
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type Props = {
  imageUrl?: string
  imageBg?: string
  title: string
  description?: string
  showLayoutDescription?: boolean
  textColor?: string
  action?: ReactNode | undefined
  background?: string
  backgroundImage?: string
}

const Layout = ({
  imageUrl,
  imageBg,
  title,
  description,
  showLayoutDescription,
  textColor,
  action,
  background,
  backgroundImage,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const childrenWrapper = useRef(null)
  const [bgHeight, setBgHeight] = useState("0")

  useIsomorphicLayoutEffect(() => {
    if (!childrenWrapper?.current) return

    const rect = childrenWrapper.current.getBoundingClientRect()
    setBgHeight(`${rect.top + 105}px`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, childrenWrapper?.current, action, isMobile])

  const { colorMode } = useColorMode()

  const exactImageSize = useBreakpointValue({
    base: "1.5rem",
    lg: "2rem",
  })

  return (
    <>
      <Head>
        <title>{`${title}`}</title>
        <meta property="og:title" content={`${title}`} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
          </>
        )}
      </Head>
      <Box
        position="relative"
        bgColor={colorMode === "light" ? "gray.100" : "gray.800"}
        bgGradient={
          !background &&
          `linear(${
            colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
          } 0px, var(--chakra-colors-gray-100) 700px)`
        }
        bgBlendMode={colorMode === "light" ? "normal" : "color"}
        minHeight="100vh"
      >
        {background && (
          <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h={bgHeight}
            background={backgroundImage ? "gray.900" : background}
            opacity={colorMode === "dark" && !backgroundImage ? "0.5" : 1}
          >
            {backgroundImage && (
              <Box opacity={0.4}>
                <Image
                  src={backgroundImage}
                  alt="Hall background image"
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
            )}
          </Box>
        )}
        <Header />
        <Container
          // to be above the absolutely positioned background box
          position="relative"
          maxW="container.lg"
          pt={{ base: 4, md: 9 }}
          pb={{ base: 20, md: 14 }}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <VStack spacing={{ base: 2, md: 10 }} pb={{ base: 12, md: 14 }} w="full">
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={{ base: 4, md: 8 }}
              alignItems={{ base: "start", md: "center" }}
              justify="space-between"
              pb="4"
              w="full"
            >
              <HStack alignItems="center" spacing={{ base: 3, md: 4, lg: 5 }}>
                {imageUrl && (
                  <GuildLogo
                    imageUrl={imageUrl}
                    size={{ base: 10, md: 12, lg: 14 }}
                    iconSize={8}
                    mt={{ base: 1, lg: 2 }}
                    bgColor={imageBg ? imageBg : undefined}
                  />
                )}
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontFamily="display"
                  color={textColor}
                >
                  {title}
                </Heading>
              </HStack>

              {action}
            </Stack>
            {showLayoutDescription && description?.length && (
              <Text w="full" fontWeight="semibold" color={textColor}>
                {description}
              </Text>
            )}
          </VStack>
          <Box ref={childrenWrapper}>{children}</Box>
        </Container>

        <Footer />
      </Box>
    </>
  )
}

export default Layout
