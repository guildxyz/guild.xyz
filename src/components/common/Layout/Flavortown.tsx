import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Img,
  Link,
  Text,
  useBreakpointValue,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import useIsomorphicLayoutEffect from "hooks/useIsomorphicLayoutEffect"
import Head from "next/head"
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

const Flavortown = ({
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
        // position="relative"
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
                  margin={10}
                  as="h1"
                  fontSize={76}
                  fontFamily="display"
                  color={textColor}
                  wordBreak={"break-word"}
                  textAlign="left"
                >
                  {title}
                  <Text textAlign="left" fontSize="36" w="full" marginY={4}>
                    Flavortown is where all the action happens! With your dragontail
                    in hand, take your pick from our juicy yield options below:
                  </Text>
                </Heading>
                <Flex
                  position="relative"
                  maxW="container.md"
                  //   pb={12}
                  py={12}
                  w="full"
                >
                  <Container>
                    <Box height="300px" width="300px">
                      <Img
                        height="300"
                        src={
                          "https://images.pexels.com/photos/5779786/pexels-photo-5779786.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                        }
                      />
                    </Box>
                  </Container>
                  <Container>
                    <Text width="full" textAlign="left" fontSize="36">
                      $MAGIC Staking
                    </Text>
                    <Text textAlign="left" fontSize="24">
                      Make the best use of your spare Magic by staking in our pool.
                      We optimize assets to bring you the best yields in town!
                      <br />
                      <br />
                    </Text>

                    <Link
                      href={`/stake-magic`}
                      prefetch={false}
                      _hover={{ textDecor: "none" }}
                    >
                      <AccountCard>
                        <AccountButton
                          // isLoading={!triedEager}
                          // onClick={openWalletSelectorModal}
                          height={16}
                          width={350}
                          fontSize={24}
                        >
                          stake $MAGIC now
                        </AccountButton>
                      </AccountCard>
                    </Link>
                  </Container>
                </Flex>

                <Flex
                  position="relative"
                  maxW="container.md"
                  //   pb={12}
                  py={12}
                  w="full"
                >
                  <Container>
                    <Box height="300px" width="300px">
                      <Img
                        height="300"
                        src={
                          "https://images.pexels.com/photos/5779786/pexels-photo-5779786.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                        }
                      />
                    </Box>
                  </Container>
                  <Container>
                    <Text textAlign="left" fontSize="36">
                      Treasure and Legion Staking
                    </Text>
                    <Text textAlign="left" fontSize="24">
                      Have some assets you’d like to contribute? You can gain more
                      yield from them through collaborative staking! Check out our
                      incentives.
                      <br />
                      <br />
                    </Text>

                    <Link
                      href={`/stake-treasure`}
                      prefetch={false}
                      _hover={{ textDecor: "none" }}
                    >
                      <AccountCard>
                        <AccountButton
                          // isLoading={!triedEager}
                          // onClick={openWalletSelectorModal}
                          height={16}
                          width={350}
                          fontSize={24}
                        >
                          stake treasure and legion now
                        </AccountButton>
                      </AccountCard>
                    </Link>
                  </Container>
                </Flex>
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

export default Flavortown
