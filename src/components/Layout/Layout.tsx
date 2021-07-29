import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  useColorMode,
} from "@chakra-ui/react"
import Account from "components/web3Connection/Account"
import Head from "next/head"
import ColorModeSwitch from "./components/ColorModeSwitch"
import LogoWithMenu from "./components/LogoWithMenu"

type Props = {
  title: string
  children: JSX.Element
}

const Layout = ({ title, children }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Box
        bgColor={
          colorMode === "light" ? "gray.100" : "var(--chakra-colors-gray-800)"
        }
        bgGradient={`linear(${
          colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
        } 0px, var(--chakra-colors-primary-100) 700px)`}
        bgBlendMode={colorMode === "light" ? "normal" : "color"}
        minHeight="100vh"
      >
        <Flex w="full" justifyContent="space-between" alignItems="center" p="2">
          <LogoWithMenu />
          <ColorModeSwitch />
        </Flex>
        <Container
          maxW="container.lg"
          pt={{ base: 4, md: 9 }}
          pb={{ base: 20, md: 14 }}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <HStack
            spacing={{ md: 8 }}
            justify="space-between"
            pb={{ base: 8, md: 16 }}
          >
            <Heading
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontFamily="display"
            >
              {title}
            </Heading>
            <Account />
          </HStack>
          {children}
        </Container>
      </Box>
    </>
  )
}

export default Layout
