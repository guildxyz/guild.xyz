import { Stack, Text } from "@chakra-ui/react"
import Head from "next/head"

const Page = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Guildhall</title>
        <meta property="og:title" content="Guildhall" />
        <meta name="description" content="A place for Web3 guilds" />
        <meta property="og:description" content="A place for Web3 guilds" />
      </Head>
      <Stack
        bgColor="gray.800"
        minHeight="100vh"
        justifyContent="center"
        alignItems="center"
        p="8"
      >
        <Text
          fontFamily="display"
          fontSize="4xl"
          textAlign="center"
          fontWeight="bold"
          color="white"
        >
          Under maintenance
          <br />
          Check back later!
        </Text>
      </Stack>
    </>
  )
}

export default Page
