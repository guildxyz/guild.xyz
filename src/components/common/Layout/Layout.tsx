import {
  AspectRatio,
  Box,
  Center,
  Container,
  Fade,
  Flex,
  Heading,
  HStack,
  Text,
  useBreakpointValue,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import useIsomorphicLayoutEffect from "hooks/useIsomorphicLayoutEffect"
import Head from "next/head"
import Image from "next/image"
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react"
import GuildLogo from "../GuildLogo"
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
  const [isHeadingShown, setIsHeadingShown] = useState(true)
  const [isSubheadingShown, setIsSubheadingShown] = useState(true)
  const [isFireBreathingGifShown, setIsFireBreathingGifShown] = useState(true)
  const [isBodyTextShowing, setIsBodyTextShowing] = useState(false)
  const [isVideoShowing, setIsVideoShowing] = useState(false)
  const [isBackroundImageShowing, setIsBackgroundImageShowing] = useState(true)

  const fadeInContent = () => {
    // setTimeout(() => setIsHeadingShown(true), 500)
    // setTimeout(() => setIsSubheadingShown(true), 2000)
    // setTimeout(() => setIsFireBreathingGifShown(true), 2000)
    setTimeout(() => setIsHeadingShown(false), 10000)
    setTimeout(() => setIsFireBreathingGifShown(false), 10000)
    setTimeout(() => setIsBackgroundImageShowing(false), 10000)
    setTimeout(() => setIsSubheadingShown(false), 10000)
    setTimeout(() => setIsBodyTextShowing(true), 11000)
    setTimeout(() => setIsVideoShowing(true), 11000)
  }

  useEffect(() => {
    fadeInContent()
  }, [])

  const TypingAnimation = ({ content = "", speed = 1000, fontFamily }) => {
    const [displayedContent, setDisplayedContent] = useState("")

    const [index, setIndex] = useState(0)

    useEffect(() => {
      /*Create a new setInterval and store its id*/
      const animKey = setInterval(() => {
        setIndex((index) => {
          /*This setState function will set the index
        to index+1 if there is more content otherwise
        it will destory this animation*/

          if (index >= content.length - 1) {
            clearInterval(animKey)
            return index
          }
          return index + 1
        })
        return
      }, speed)
    }, [content, speed])

    useEffect(() => {
      setDisplayedContent((displayedContent) => displayedContent + content[index])
    }, [content, index])

    return (
      <>
        <Text fontFamily={fontFamily || "display"} className="type-writer">
          {displayedContent}
        </Text>
      </>
    )
  }

  return (
    <Box>
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
        bgColor={isBackroundImageShowing ? "#150000" : "black"}
        bgImage={isBackroundImageShowing ? "url('/assets/fire.png')" : null}
        // bgGradient={
        //   !background &&
        //   `linear(${
        //     colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
        //   } 0px, var(--chakra-colors-gray-100) 700px)`
        // }
        // bgBlendMode={colorMode === "light" ? "normal" : "color"}
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
                  color={"#C9C8C3"}
                  fontWeight="bold"
                  wordBreak={"break-word"}
                  textAlign="center"
                ></Heading>

                <Fade in={isBodyTextShowing}>
                  <Text
                    fontSize={28}
                    fontFamily="body"
                    color={textColor}
                    wordBreak={"break-word"}
                    textAlign="center"
                    bgcolor="yellow"
                  >
                    <Flex width="full" justify="justify-between">
                      <TypingAnimation
                        content={`see what we're about`}
                        speed={100}
                        fontFamily={"body"}
                      />
                      <Image
                        src={"/assets/white_arrow.png"}
                        alt="white arrow"
                        width="50"
                        height="10"
                      />
                    </Flex>
                  </Text>
                </Fade>
                <Fade in={isSubheadingShown}>
                  <Text
                    as="h2"
                    fontSize={80}
                    fontFamily="display"
                    color={"#C9C8C3"}
                    wordBreak={"break-word"}
                    textAlign="center"
                    marginTop={-22}
                  >
                    <TypingAnimation
                      content={` and taste the spice`}
                      speed={100}
                      fontFamily={"display"}
                    />
                  </Text>
                  <Center width={1000} height={400}>
                    <Container
                      maxW="container.md"
                      width="350px"
                      height="343px"
                      justifyContent="center"
                      // px={{ base: 40, sm: 6, md: 8, lg: 2 }}
                      margingTop={-32}
                    >
                      <AspectRatio
                        px={{ base: 40, sm: 6, md: 8, lg: 2 }}
                        maxW={350}
                        height={343}
                        ratio={1}
                        autoPlay={true}
                      >
                        <iframe
                          title="fire-breathing-gif"
                          src="https://www.kapwing.com/e/6216f880e8513f007fc21173"
                        />
                      </AspectRatio>
                    </Container>
                  </Center>
                </Fade>

                <Fade in={isVideoShowing}>
                  <Container
                    maxW="container.md"
                    width="633px"
                    height="400px"
                    backgroundColor="yellow"
                    borderWidth="10"
                    justifyContent="center"
                    paddingTop="2"
                    marginTop={-450}
                    px={{ base: 40, sm: 6, md: 8, lg: 2 }}
                  >
                    <AspectRatio height={385} width={617} ratio={1} autoPlay={true}>
                      <iframe
                        title="flavor-video"
                        src="assets/flavor_intro_video.mp4"
                        allowFullScreen
                      />
                    </AspectRatio>
                  </Container>
                  <Center>
                    <Image
                      src={"/assets/yellow_arrow_down.png"}
                      alt="yellow arrow down"
                      width="50"
                      height="40"
                    />
                  </Center>
                </Fade>

                {/* <Text textAlign="justify" fontSize="24">
                    Juicy yields and impeccable tase <br />
                    <br />
                    We are a Treasure guild serving up the spice. Join us to max out
                    your $Magic yield`s, stake your Treasures or Legions for bonuses,
                    and more!
                    <br />
                    <br />
                    Treasure is an ecosystem build on cooperation. Group coordination
                    leads to higher rewards for all!
                  </Text>*/}

                {/* <Link
                  href={`https://www.treasure.lol/`}
                  target={"_blank"}
                  prefetch={false}
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
                </Link> */}
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
        {/* <Footer /> */}
      </Box>
    </Box>
  )
}

export default Layout
