// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  SimpleGrid,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import Layout from "components/common/Layout"
import GuildCard from "components/index/GuildCard"
import { GetStaticProps } from "next"
import Head from "next/dist/next-server/lib/head"
import { MagnifyingGlass } from "phosphor-react"
import { useMemo, useRef, useState } from "react"
import guildsJSON from "temporaryData/guilds"
import { Guild } from "temporaryData/types"

type Props = {
  guilds: Guild[]
}

const Page = ({ guilds }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const [searchInput, setSearchInput] = useState("")
  const inputTimeout = useRef(null)
  const filteredGuilds = useMemo(
    () =>
      guilds.filter(({ name }) =>
        name.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [guilds, searchInput]
  )
  const handleOnChange = async ({ target: { value } }) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(value), 300)
  }

  // return (
  //   <>
  //     <Head>
  //       <title>Guildhall</title>
  //       <meta property="og:title" content="Guildhall" />
  //       <meta name="description" content="A place for Web3 guilds" />
  //       <meta property="og:description" content="A place for Web3 guilds" />
  //     </Head>
  //     <HStack
  //       bgColor="gray.800"
  //       minHeight="100vh"
  //       justifyContent="center"
  //       alignItems="center"
  //     >
  //       <Text
  //         fontFamily="display"
  //         fontSize="4xl"
  //         textAlign="center"
  //         fontWeight="bold"
  //       >
  //         Coming soon!
  //       </Text>
  //     </HStack>
  //   </>
  // )

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
      <InputGroup size="lg" mb={16} maxW="600px">
        <InputLeftElement>
          <MagnifyingGlass color="#858585" size={20} />
        </InputLeftElement>
        <Input
          placeholder="Search for guilds"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          colorScheme="primary"
          borderRadius="15px"
          bg={colorMode === "light" ? "white" : "gray.900"}
          onChange={handleOnChange}
        />
      </InputGroup>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        {filteredGuilds.map((guild) => (
          <GuildCard key={guild.id} guildData={guild} />
        ))}
      </SimpleGrid>
    </Layout>
  )
}

const DEBUG = false

export const getStaticProps: GetStaticProps = async () => {
  const guilds =
    DEBUG && process.env.NODE_ENV !== "production"
      ? guildsJSON
      : await fetch(`${process.env.NEXT_PUBLIC_API}/community/guilds/all`).then(
          (response) => (response.ok ? response.json() : null)
        )

  return {
    props: { guilds },
    revalidate: 10,
  }
}

export default Page
