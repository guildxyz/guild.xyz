import {
  AspectRatio,
  Box,
  Container,
  Heading,
  HStack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import useIsomorphicLayoutEffect from "hooks/useIsomorphicLayoutEffect"
import Head from "next/head"
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

  const guildLogoSize = useBreakpointValue({ base: 48, lg: 56 })
  const guildLogoIconSize = useBreakpointValue({ base: 20, lg: 28 })

  const TypingAnimation = ({ content = "", speed = 1000, fontFamily }) => {
    const [displayedContent, setDisplayedContent] = useState("")

    const [index, setIndex] = useState(0)

    useEffect(() => {
      /*Create a new setInterval and store its id*/
      const animKey = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
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
      // eslint-disable-next-line @typescript-eslint/no-shadow
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
        zIndex={100}
        bgColor={"black"}
        bgImage={null}
        width={"100%"}
        backgroundSize={"cover"}
        d="flex"
        flexDir={"column"}
        justifyContent="center"
        overflowX="hidden"
      >
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
                  fontSize={80}
                  fontFamily="display"
                  color={"#C9C8C3"}
                  fontWeight="bold"
                  wordBreak={"break-word"}
                  textAlign="center"
                >
                  {title}
                </Heading>
                <Container
                  maxW="container.md"
                  width="633px"
                  height="400px"
                  justifyContent="center"
                  paddingTop="2"
                  marginTop={-500}
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
