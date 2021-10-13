import { Box } from "@chakra-ui/react"
import Head from "next/head"

const Page404 = () => {
  return (
    <>
      <Head>
        <title>404 - page not found</title>
      </Head>
      <Box bgColor="gray.800" minHeight="100vh">
        Uh-oh!
      </Box>
    </>
  )
}

export default Page404
