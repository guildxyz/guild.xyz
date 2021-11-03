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
import { PropsWithChildren, ReactNode } from "react"
import GuildLogo from "../GuildLogo"
import Footer from "./components/Footer"
import Header from "./components/Header"

type Props = {
  imageUrl?: string
  imageBg?: string
  title: string
  description?: string
  textColor?: string
  action?: ReactNode | undefined
  background?: JSX.Element
}

const Layout = ({
  imageUrl,
  imageBg,
  title,
  description,
  textColor,
  action,
  background,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
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
          } 0px, var(--chakra-colors-primary-100) 700px)`
        }
        bgBlendMode={colorMode === "light" ? "normal" : "color"}
        minHeight="100vh"
      >
        {background}
        <Header />
        <Container
          maxW="container.lg"
          pt={{ base: 4, md: 9 }}
          pb={{ base: 20, md: 14 }}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <VStack
            position="relative"
            spacing={{ base: 3, md: 4, lg: 5 }}
            pb={{ base: 8, md: 16 }}
            width="full"
            alignItems="start"
          >
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={{ base: 4, md: 8 }}
              alignItems={{ base: "start", md: "center" }}
              justify="space-between"
              width="full"
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

            {description?.length && (
              <Text fontWeight="semibold" color={textColor}>
                {description}
              </Text>
            )}
          </VStack>
          {children}
        </Container>

        <Footer />
      </Box>
    </>
  )
}

export default Layout
