// eslint-disable-next-line import/no-extraneous-dependencies
import { SimpleGrid } from "@chakra-ui/layout"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import GuildCard from "components/index/GuildCard"
import React from "react"
import { guilds } from "temporaryData/guilds"

const Page = (): JSX.Element => {
  const { account } = useWeb3React()

  return (
    <Layout title="guild.xyz">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        {guilds.map((guild) => (
          <GuildCard key={guild.id} guildData={guild} />
        ))}
        {account && <AddCard text="Add guild" link="/add-guild" />}
      </SimpleGrid>
    </Layout>
  )
}

export default Page
