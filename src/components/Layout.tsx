import { Container, Heading, HStack } from "@chakra-ui/react"
import Head from "next/head"
import Account from "components/web3Connection/Account"
import { Token } from "temporaryData/types"

type Props = {
  title: string
  token: Token
  children: JSX.Element
}

const Layout = ({ title, token, children }: Props): JSX.Element => (
  <>
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {/* <link rel="icon" href="/favicon.ico" /> */}
    </Head>
    <Container maxW="container.lg" py={24} px={10}>
      <HStack justify="space-between" align="center" pb={16}>
        <Heading size="2xl" fontFamily="Dystopian">
          {title}
        </Heading>
        <Account token={token} />
      </HStack>
      {children}
    </Container>
  </>
)

export default Layout
