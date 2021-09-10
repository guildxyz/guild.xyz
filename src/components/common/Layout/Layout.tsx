import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Tag,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Account from "components/common/Layout/components/Account"
import Link from "components/common/Link"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import { ArrowUUpLeft } from "phosphor-react"
import { PropsWithChildren, ReactNode } from "react"

type Props = {
  title: string
  subTitle?: string
  description?: string
  action?: ReactNode | undefined
}

const Layout = ({
  title,
  subTitle,
  description,
  action,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()
  const router = useRouter()

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
          {router.asPath !== "/" && (
            <Link href="/">
              <Icon width="1.4em" height="1.4em" as={ArrowUUpLeft} />
            </Link>
          )}
          <Account />
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
            <VStack alignItems="start" spacing={{ base: 3, md: 4, lg: 5 }}>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontFamily="display"
              >
                {title}
              </Heading>

              {subTitle && <Tag>{subTitle}</Tag>}
            </VStack>

            {action}
          </HStack>
          {children}
        </Container>

        <Text mt={16} pb={8} textAlign="center" colorScheme="gray">
          This website is{" "}
          <a
            href="https://github.com/AgoraSpaceDAO/guild.xyz"
            target="_blank"
            rel="noreferrer"
          >
            <Text as="span" display="inline" color="blue.400">
              open-source
            </Text>
          </a>
        </Text>
      </Box>
    </>
  )
}

export default Layout
