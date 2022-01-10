import { Button, Img, Text, VStack } from "@chakra-ui/react"
import Link from "components/common/Link"
import Head from "next/head"

const Page = (): JSX.Element => (
  <>
    <Head>
      <title>Guildhall</title>
      <meta property="og:title" content="Guildhall" />
      <meta name="description" content="A place for Web3 guilds" />
      <meta property="og:description" content="A place for Web3 guilds" />
    </Head>
    <VStack
      bgColor="gray.800"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Text
        fontFamily="display"
        fontSize="4xl"
        textAlign="center"
        fontWeight="bold"
        color="white"
      >
        Coming soon!
      </Text>
      <Text pt={4}>Try the alpha!</Text>
      <Link href="https://alpha.guild.xyz" _hover={{ textDecor: "none" }}>
        <Button size="sm" leftIcon={<Img src="/guildLogos/logo.svg" boxSize={4} />}>
          alpha.guild.xyz
        </Button>
      </Link>
    </VStack>
  </>
)

export default Page
