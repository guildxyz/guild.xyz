import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Img,
  useColorMode,
} from "@chakra-ui/react"
import Account from "components/common/Layout/components/Account"
import Head from "next/head"
import ColorModeSwitch from "./components/ColorModeSwitch"
import LogoWithMenu from "./components/LogoWithMenu"

type Props = {
  title: string
  imageUrl?: string
  children: JSX.Element
}

const Layout = ({ title, imageUrl = null, children }: Props): JSX.Element => {
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
            <HStack alignItems="center" spacing={{ base: 3, md: 4, lg: 5 }}>
              {imageUrl && (
                <Img
                  src={imageUrl}
                  boxSize={{ base: 10, md: 12, lg: 14 }}
                  borderRadius="full"
                />
              )}
              <Heading
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontFamily="display"
                pb={imageUrl && { base: 1, lg: 2 }}
              >
                {title}
              </Heading>
            </HStack>
            <Account />
          </HStack>
          {children}
        </Container>
      </Box>
    </>
  )
}

export default Layout
