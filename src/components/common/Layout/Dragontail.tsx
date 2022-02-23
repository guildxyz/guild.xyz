import {
  Box,
  Center,
  Container,
  Heading,
  HStack,
  Img,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
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

const Dragontail = ({
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

  const BuyNowButton = () => (
    <Link href={`/congratulations`} prefetch={false} _hover={{ textDecor: "none" }}>
      <AccountCard>
        <AccountButton
          // isLoading={!triedEager}
          // onClick={openWalletSelectorModal}
          height={39}
          width={105}
          fontSize={16}
        >
          buy now
        </AccountButton>
      </AccountCard>
    </Link>
  )

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
                  marginTop={10}
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
                  px={12}
                  w="full"
                >
                  <Text textAlign="justify" fontSize="24">
                    To take part in our juicy yields, Chef Firey needs to issue you
                    your Flavor Membership Badge.
                    <br /> <br />
                    Chef Firey’s favorite ingredient is dragon tail - and he’ll
                    gladly trade a membership badge for one!
                    <br />
                    <br />
                    Don’t worry, if you no longer want to be a guild member, you can
                    trade it back any time.. Chef just likes to check the wallets of
                    the initiated to make sure they’re part of the fam.
                    <br />
                    <br />
                    Once you secure your membership badge, head on down to
                    Flavortown!
                    <br />
                  </Text>
                  <Heading
                    margin={8}
                    as="h6"
                    fontSize={36}
                    fontFamily="display"
                    color={textColor}
                    wordBreak={"break-word"}
                    textAlign="center"
                  >
                    Buy a Dragontail From Us
                  </Heading>
                  <Container w="full" flex-Wrap="noWrap" flexDirection="row">
                    <Center>
                      <Img
                        width="200"
                        height="320"
                        src={
                          "https://images.pexels.com/photos/5779786/pexels-photo-5779786.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                        }
                      />

                      <Container>
                        <Text textAlign="left">Listings</Text>
                        <Table size="sm" width="100%">
                          <Thead bgColor="gray">
                            <Tr>
                              <Th isNumeric color="white" flexDirection="row">
                                Unit Price
                              </Th>
                              <Th isNumberic color="white">
                                Quanity
                              </Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td isNumeric>97</Td>
                              <Td isNumeric>2</Td>
                              <Td>
                                <BuyNowButton />
                              </Td>
                            </Tr>
                            <Tr>
                              <Td isNumeric>98.3</Td>
                              <Td isNumeric>5</Td>
                              <Td>
                                <BuyNowButton />
                              </Td>
                            </Tr>
                            <Tr>
                              <Td isNumeric>99.5</Td>
                              <Td isNumeric>1</Td>
                              <Td>
                                <BuyNowButton />
                              </Td>
                            </Tr>
                            <Tr>
                              <Td isNumeric>100.1</Td>
                              <Td isNumeric>1</Td>
                              <Td>
                                <BuyNowButton />
                              </Td>
                            </Tr>
                            <Tr>
                              <Td isNumeric>100.30000000001</Td>
                              <Td isNumeric>1</Td>
                              <Td>
                                <BuyNowButton />
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Container>
                    </Center>
                  </Container>
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
        <Footer />
      </Box>
    </>
  )
}

export default Dragontail
