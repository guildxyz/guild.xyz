import { Box, Container, Heading, HStack } from "@chakra-ui/react"
import Head from "next/head"
import Account from "components/web3Connection/Account"

type Props = {
  title: string
  bg?: string
  children: JSX.Element
}

const Layout = ({ title, bg = "white", children }: Props): JSX.Element => (
  <>
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {/* <link rel="icon" href="/favicon.ico" /> */}
    </Head>
    <Box bg={bg} minHeight="100vh">
      <Container maxW="container.lg" py={24} px={10}>
        <HStack justify="space-between" align="center" pb={16}>
          <Heading size="2xl" fontFamily="display">
            {title}
          </Heading>
          <Account />
        </HStack>
        {children}
      </Container>
    </Box>
  </>
)

export default Layout
