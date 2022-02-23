import {
  Box,
  Center,
  Circle,
  Container,
  Flex,
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

const StakeTreasure = ({
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
                    Staking $MAGIC means ipsum dolor sit amet, consectetur adipiscing
                    elit. Cras ultrices tellus neque, sed aliquet neque convallis eu.
                  </Text>
                </Heading>
                <Container
                  position="relative"
                  maxW="container.md"
                  pb={12}
                  px={12}
                  w="full"
                  centerContent
                >
                  <Center margin={4}>
                    <Container>
                      <Text fontSize={36} textAlign="left">
                        The Pantry
                      </Text>
                      <Table size="lg" width="500px">
                        <Thead bgColor="gray">
                          <Tr>
                            <Th isNumeric color="white" flexDirection="row">
                              Staking Rate
                            </Th>
                            <Th isNumberic color="white" textAlign="right">
                              $MAGIC Emissions
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td isNumeric>{`< 300%`}</Td>
                            <Td isNumeric>None</Td>
                          </Tr>
                          <Tr>
                            <Td isNumeric>300%</Td>
                            <Td isNumeric>50%</Td>
                          </Tr>
                          <Tr>
                            <Td isNumeric>400%</Td>
                            <Td isNumeric>60%</Td>
                          </Tr>
                          <Tr>
                            <Td isNumeric>500%</Td>
                            <Td isNumeric>80%</Td>
                          </Tr>
                          <Tr>
                            <Td isNumeric>600%</Td>
                            <Td isNumeric>100%</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Container>
                  </Center>
                  <Circle size="140px" bgColor="white" margin={8}>
                    <Img
                      height="50px"
                      src={
                        "https://api.gamefi.review/uploads/magic_icon_636499fa22.png"
                      }
                    />
                  </Circle>
                  <Text fontSize="36">Treasure and Legion</Text>
                </Container>
                <Flex>
                  <Box
                    borderWidth="3px"
                    borderColor="rgba(237, 227, 228, 0.32)"
                    mx={8}
                    my={4}
                    h={20}
                    width="255px"
                  >
                    <Text
                      fontSize="12"
                      color="#EDE3E4"
                      marginTop={4}
                      textAlign="center"
                    >
                      total staked
                    </Text>
                    <Text
                      fontSize="21"
                      color="#EDE3E4"
                      marginTop={1}
                      textAlign="center"
                    >
                      0.0
                    </Text>
                  </Box>
                  <Box
                    borderWidth="3px"
                    borderColor="rgba(237, 227, 228, 0.32)"
                    px={8}
                    h={20}
                    my={4}
                    width="255px"
                  >
                    <Text
                      fontSize="12"
                      color="#EDE3E4"
                      marginTop={4}
                      textAlign="center"
                    >
                      total NFT boost
                    </Text>
                    <Text
                      fontSize="21"
                      color="#EDE3E4"
                      marginTop={1}
                      textAlign="center"
                    >
                      0.0
                    </Text>
                  </Box>
                </Flex>
                <Flex>
                  <Box
                    borderWidth="3px"
                    borderColor="rgba(237, 227, 228, 0.32)"
                    mx={8}
                    h={12}
                    width="255px"
                  >
                    <Text
                      fontFamily="VT323"
                      fontSize="21"
                      color="#EDE3E4"
                      textAlign="center"
                      paddingTop={1}
                    >
                      stake
                    </Text>
                  </Box>
                  <Box
                    borderWidth="3px"
                    borderColor="rgba(237, 227, 228, 0.32)"
                    px={8}
                    h={12}
                    width="255px"
                  >
                    <Text
                      fontFamily="VT323"
                      fontSize="21"
                      color="#EDE3E4"
                      textAlign="center"
                      paddingTop={1}
                    >
                      unstake
                    </Text>
                  </Box>
                </Flex>
                <br />
                <br />
                <br />
                <br />
                <Link
                  href={`/flavortown`}
                  prefetch={false}
                  _hover={{ textDecor: "none" }}
                >
                  <AccountCard>
                    <AccountButton
                      // isLoading={!triedEager}
                      // onClick={openWalletSelectorModal}
                      height={24}
                      width={250}
                      fontSize={21}
                    >
                      take me back to the guild
                    </AccountButton>
                  </AccountCard>
                </Link>
                <br />
                <Link
                  href={`/stake-magic`}
                  prefetch={false}
                  _hover={{ textDecor: "none" }}
                >
                  <AccountCard>
                    <AccountButton
                      // isLoading={!triedEager}
                      // onClick={openWalletSelectorModal}
                      height={24}
                      width={250}
                      fontSize={21}
                    >
                      stake $MAGIC now
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

export default StakeTreasure
