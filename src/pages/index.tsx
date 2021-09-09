// eslint-disable-next-line import/no-extraneous-dependencies
import { SimpleGrid } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import GuildCard from "components/index/GuildCard"
import React from "react"
import guilds from "temporaryData/guilds"

const Page = (): JSX.Element => (
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

export default Page
