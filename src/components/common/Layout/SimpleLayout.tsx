import { Box, Container, Heading, Stack, useColorModeValue } from "@chakra-ui/react"
import Head from "next/head"
import { PropsWithChildren } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"

type Props = {
  title: string
}

const SimpleLayout = ({
  title,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const bgColor = useColorModeValue("gray.100", "gray.800")

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/guild-icon.png" />
      </Head>
      <Box bgColor={bgColor} minHeight="100vh" display="flex" flexDir="column">
        <Header />
        <Container
          maxW="container.lg"
          pt={{ base: 6, md: 9 }}
          pb={24}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <Stack spacing={{ base: 7, md: 10 }} pb={{ base: 9, md: 14 }} w="full">
            <Heading
              as="h1"
              fontSize={{ md: "4xl", lg: "5xl" }}
              fontFamily="display"
              wordBreak="break-word"
              display={{ base: "none", md: "block" }}
            >
              {title}
            </Heading>
            {children}
          </Stack>
        </Container>
        <Footer />
      </Box>
    </>
  )
}

export default SimpleLayout
