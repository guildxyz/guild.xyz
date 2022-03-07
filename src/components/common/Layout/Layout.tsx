import {
  AspectRatio,
  Box,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import useIsomorphicLayoutEffect from "hooks/useIsomorphicLayoutEffect"
import Head from "next/head"
import { useRouter } from "next/router"
import { PropsWithChildren, ReactNode, useRef, useState } from "react"
import GuildLogo from "../GuildLogo"
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

  const router = useRouter()

  const guildLogoSize = useBreakpointValue({ base: 48, lg: 56 })
  const guildLogoIconSize = useBreakpointValue({ base: 20, lg: 28 })

  // const skipToVideo = () => {
  //   router.push("/video")
  // }

  // useEffect(() => {}, [])

  // const TypingAnimation = ({ content = "", speed = 1000, fontFamily }) => {
  //   const [displayedContent, setDisplayedContent] = useState("")

  //   const [index, setIndex] = useState(0)

  //   useEffect(() => {
  //     /*Create a new setInterval and store its id*/
  //     const animKey = setInterval(() => {
  //       // eslint-disable-next-line @typescript-eslint/no-shadow
  //       setIndex((index) => {
  //         /*This setState function will set the index
  //       to index+1 if there is more content otherwise
  //       it will destory this animation*/

  //         if (index >= content.length - 1) {
  //           clearInterval(animKey)
  //           return index
  //         }
  //         return index + 1
  //       })
  //       return
  //     }, speed)
  //   }, [content, speed])

  //   useEffect(() => {
  //     // eslint-disable-next-line @typescript-eslint/no-shadow
  //     setDisplayedContent((displayedContent) => displayedContent + content[index])
  //   }, [content, index])

  //   return (
  //     <>
  //       <Text fontFamily={fontFamily || "display"} className="type-writer">
  //         {displayedContent}
  //       </Text>
  //     </>
  //   )
  // }

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
        zIndex={10}
        bgColor={"black"}
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
          zIndex={1}
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
                  fontSize={40}
                  fontFamily="PressStart2P"
                  color={"#FFF3BF"}
                  fontWeight="bold"
                  wordBreak={"break-word"}
                  textAlign="center"
                >
                  {title}
                </Heading>
                <Text
                  as="h2"
                  fontSize={40}
                  fontFamily="PressStart2P"
                  color={"#FFF3BF"}
                  wordBreak={"break-word"}
                  textAlign="center"
                >
                  And Taste The Spice!
                </Text>

                <Flex>
                  <Container width={350} margingTop={-32}>
                    <AspectRatio maxW={350} height={343} ratio={1} autoPlay={true}>
                      <iframe
                        title="fire-breathing-gif"
                        src="https://www.kapwing.com/e/6216f880e8513f007fc21173"
                      />
                    </AspectRatio>
                  </Container>
                  <Link
                    target="_blank"
                    href={`https://discord.com/channels/933057635790491768/933076807157182514`}
                    prefetch={false}
                    _hover={{ textDecor: "none" }}
                  >
                    <Image
                      alt="join discord"
                      width={363}
                      height={85.25}
                      src="assets/joinDiscord.png"
                    />
                  </Link>
                </Flex>

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

        <Image
          alt="fire"
          width={1800}
          height={500}
          src="flavorLogos/fire.svg"
          marginTop={-80}
        />
        <Text
          as="h2"
          fontSize={40}
          fontFamily="PressStart2P"
          color={"#FFF3BF"}
          wordBreak={"break-word"}
          textAlign="center"
        >
          See What We Are About
        </Text>
        <Container width={350} margingTop={-32}>
          <AspectRatio maxW={350} height={343} ratio={1} autoPlay={true}>
            <iframe
              title="fire-breathing-gif"
              src="https://www.kapwing.com/e/6216f880e8513f007fc21173"
            />
          </AspectRatio>
        </Container>
        <Center>
          <Text
            fontSize="24"
            fontFamily="PressStart2P"
            color="#FFF3BF"
            width={940}
            marginLeft={4}
          >
            <br />
            Juicy yields and impeccable taste
            <br />
            <br />
            We are a Treasure guild serving up the spice. Join us to max out your
            $MAGIC yields, stake your Treasures or Legions for bonuses, and more!
            <br />
            <br />
            Treasure is an ecosystem built on cooperation. Group coordination leads
            to higher rewards for all!
          </Text>
        </Center>
        <Center margin={8}>
          <Link
            target="_blank"
            href={`https://airtable.com/shr4PJoVfeBvGm2yZ`}
            prefetch={false}
            _hover={{ textDecor: "none" }}
          >
            <Image
              alt="join discord"
              width={337}
              height={68}
              src="assets/stakeWithUs.png"
            />
          </Link>
        </Center>
        <Footer />
      </Box>
    </Box>
  )
}

export default Layout
