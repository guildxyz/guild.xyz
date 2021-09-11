// eslint-disable-next-line import/no-extraneous-dependencies
import { HStack, Text } from "@chakra-ui/react"
import Head from "next/head"
import React from "react"

const Page = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Guildhall</title>
        <meta property="og:title" content="Guildhall" />
        <meta name="description" content="A place for Web3 guilds" />
        <meta property="og:description" content="A place for Web3 guilds" />
      </Head>
      <HStack
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
        >
          Coming soon!
        </Text>
      </HStack>
    </>
  )

  /*
  return (
    <Layout
      title="Guildhall"
      description="A place for Web3 guilds"
      action={
        <Link
          href="/create-guild"
          _hover={{
            textDecor: "none",
          }}
        >
          <Button rounded="2xl" colorScheme="green">
            Create Guild
          </Button>
        </Link>
      }
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        {guilds.map((guild) => (
          <GuildCard key={guild.id} guildData={guild} />
        ))}
      </SimpleGrid>
    </Layout>
  )
  */
}

export default Page
