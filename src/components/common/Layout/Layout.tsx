import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Img,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import Link from "components/common/Link"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import NextLink from "next/link"
import { House } from "phosphor-react"
import { PropsWithChildren, ReactNode } from "react"
import DotDelimiter from "../DotDelimiter"
import Account from "./components/Account"
import InfoMenu from "./components/InfoMenu"

type Props = {
  imageUrl?: string
  title: string
  description?: string
  action?: ReactNode | undefined
}

const Layout = ({
  imageUrl,
  title,
  description,
  action,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()
  const router = useRouter()

  const exactImageSize = useBreakpointValue({
    base: "2.5rem",
    md: "3rem",
    lg: "3.5rem",
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
          {router?.asPath !== "/" ? (
            <NextLink passHref href="/">
              <IconButton
                as="a"
                aria-label="Home"
                variant="ghost"
                isRound
                h="10"
                icon={<Icon width="1.2em" height="1.2em" as={House} />}
              />
            </NextLink>
          ) : (
            <Box />
          )}
          <HStack spacing="2">
            <Account />
            <InfoMenu />
          </HStack>
        </Flex>
        <Container
          maxW="container.lg"
          pt={{ base: 4, md: 9 }}
          pb={{ base: 20, md: 14 }}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <HStack
            spacing={{ md: 8 }}
            alignItems="center"
            justify="space-between"
            pb={{ base: 8, md: 16 }}
          >
            <HStack alignItems="center" spacing={{ base: 3, md: 4, lg: 5 }}>
              {imageUrl && (
                <Img
                  src={imageUrl}
                  alt={`${title} - logo`}
                  htmlWidth={exactImageSize}
                  htmlHeight={exactImageSize}
                  mt={{ base: 1, lg: 2 }}
                  boxSize={{ base: 8, lg: 10 }}
                />
              )}
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontFamily="display"
              >
                {title}
              </Heading>
            </HStack>

            {action}
          </HStack>
          {children}
        </Container>

        <Text
          mt={16}
          pb={{ base: 20, md: 8 }}
          textAlign="center"
          colorScheme="gray"
          lineHeight={2}
        >
          {`This website is `}
          <Link
            href="https://github.com/AgoraSpaceDAO/guild.xyz"
            isExternal
            colorScheme="green"
          >
            open-source
          </Link>
          <DotDelimiter wrap />
          <Link href="https://twitter.com/guildxyz" isExternal colorScheme="TWITTER">
            Twitter
          </Link>
          <DotDelimiter />
          <Link
            href="https://discord.gg/bryPA3peuT"
            isExternal
            colorScheme="DISCORD"
          >
            Discord
          </Link>
        </Text>
      </Box>
    </>
  )
}

export default Layout
