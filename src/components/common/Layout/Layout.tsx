import {
  Box,
  Container,
  Heading,
  HStack,
  Link,
  Text,
  useBreakpointValue,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import useIsomorphicLayoutEffect from "hooks/useIsomorphicLayoutEffect"
import Head from "next/head"
import Image from "next/image"
import { PropsWithChildren, ReactNode, useRef, useState } from "react"
import GuildLogo from "../GuildLogo"
import AccountButton from "./components/Account/components/AccountButton"
import AccountCard from "./components/Account/components/AccountCard"
import Footer from "./components/Footer"
import Header from "./components/Header"

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
  const childrenWrapper = useRef(null)
  const [bgHeight, setBgHeight] = useState("0")
  const isMobile = useBreakpointValue({ base: true, sm: false })

  useIsomorphicLayoutEffect(() => {
    if ((!background && !backgroundImage) || !childrenWrapper?.current) return

    const rect = childrenWrapper.current.getBoundingClientRect()
    setBgHeight(`${rect.top + (isMobile ? 32 : 36)}px`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, childrenWrapper?.current, action])

  const { colorMode } = useColorMode()
  const guildLogoSize = useBreakpointValue({ base: 48, lg: 56 })
  const guildLogoIconSize = useBreakpointValue({ base: 20, lg: 28 })

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
        bgColor={colorMode === "light" ? "gray.100" : "black"}
        bgGradient={
          !background &&
          `linear(${
            colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
          } 0px, var(--chakra-colors-gray-100) 700px)`
        }
        bgBlendMode={colorMode === "light" ? "normal" : "color"}
        minHeight="100vh"
        d="flex"
        flexDir={"column"}
        justifyContent="center"
        overflowX="hidden"
      >
        {(background || backgroundImage) && (
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
                  alt="Guild background image"
                  layout="fill"
                  objectFit="cover"
                  priority
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
          pt={{ base: 6, md: 9 }}
          pb={24}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <VStack spacing={{ base: 7, md: 10 }} pb={{ base: 9, md: 14 }} w="full">
            <HStack justify="center" w="full" spacing={3}>
              <HStack
                flexDirection="column"
                justify="center"
                spacing={{ base: 4, lg: 5 }}
              >
                {imageUrl && (
                  <GuildLogo
                    imageUrl={imageUrl}
                    size={guildLogoSize}
                    iconSize={guildLogoIconSize}
                    mt={{ base: 1, lg: 2 }}
                    bgColor={imageBg ? imageBg : undefined}
                    priority
                  />
                )}
                <Heading
                  marginTop={12}
                  as="h1"
                  fontSize={96}
                  fontFamily="display"
                  color={textColor}
                  wordBreak={"break-word"}
                  textAlign="center"
                >
                  {title}
                </Heading>
                <Container
                  position="relative"
                  maxW="container.md"
                  pb={12}
                  px={{ base: 40, sm: 6, md: 8, lg: 90 }}
                >
                  {/* <AspectRatio maxW="560px" ratio={1}>
                    <iframe
                      title="flavor-video"
                      src="assets/flavor_intro_video.mp4"
                      allowFullScreen
                    />
                  </AspectRatio> */}
                  <Text textAlign="justify" fontSize="24">
                    Juicy yields and impeccable tase <br />
                    <br />
                    We are a Treasure guild serving up the spice. Join us to max out
                    your $Magic yield`s, stake your Treasures or Legions for bonuses,
                    and more!
                    <br />
                    <br />
                    Treasure is an ecosystem build on cooperation. Group coordination
                    leads to higher rewards for all!
                  </Text>
                </Container>
                <Link
                  href={`https://www.treasure.lol/`}
                  target={"_blank"}
                  prefetch={"false"}
                  _hover={{ textDecor: "none" }}
                >
                  <AccountCard>
                    <AccountButton
                      // isLoading={!triedEager}
                      // onClick={openWalletSelectorModal}
                      width={316}
                      height={74}
                      fontSize="32"
                    >
                      get A dragontail
                    </AccountButton>
                  </AccountCard>
                </Link>
              </HStack>

              {action}
            </HStack>
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
