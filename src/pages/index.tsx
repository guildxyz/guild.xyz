import { GridItem, HStack, SimpleGrid, Stack, Tag, Text } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import HallsGuildsNav from "components/index/HallsGuildsNav"
import useFilteredData from "components/index/hooks/useFilteredData"
import useUsersHallsGuilds from "components/index/hooks/useUsersHallsGuilds"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import fetchGuilds from "components/index/utils/fetchGuilds"
import { GetStaticProps } from "next"
import { useState } from "react"
import useSWR from "swr"
import { Guild } from "temporaryData/types"

type Props = {
  guilds: Guild[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { data: guilds } = useSWR("guilds", fetchGuilds, {
    fallbackData: guildsInitial,
  })
  const [searchInput, setSearchInput] = useState("")
  const [orderedGuilds, setOrderedGuilds] = useState(guilds)

  const { usersGuildsIds } = useUsersHallsGuilds()
  const [usersGuilds, filteredGuilds, filteredUsersGuilds] = useFilteredData(
    orderedGuilds,
    usersGuildsIds,
    searchInput
  )

  return (
    <Layout title="Guild" description="A place for Web3 guilds" imageUrl="/logo.svg">
      <SimpleGrid
        templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
        gap={{ base: 2, md: "6" }}
        mb={16}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <SearchBar placeholder="Search guilds" setSearchInput={setSearchInput} />
        </GridItem>
        <OrderSelect data={guilds} setOrderedData={setOrderedGuilds} />
      </SimpleGrid>

      <HallsGuildsNav />

      <Stack spacing={12}>
        <CategorySection
          title={
            usersGuilds.length ? "Your guilds" : "You're not part of any guilds yet"
          }
          fallbackText={`No results for ${searchInput}`}
        >
          {usersGuilds.length ? (
            filteredUsersGuilds.length &&
            filteredUsersGuilds
              .map((guild) => <GuildCard key={guild.id} guildData={guild} />)
              .concat(
                <AddCard
                  key="create-guild"
                  text="Create guild"
                  link="/create-guild"
                />
              )
          ) : (
            <AddCard text="Create guild" link="/create-guild" />
          )}
        </CategorySection>
        <CategorySection
          title={
            <HStack spacing={2} alignItems="center">
              <Text as="span">All guilds</Text>
              <Tag size="sm">{filteredGuilds.length}</Tag>
            </HStack>
          }
          fallbackText={
            orderedGuilds.length
              ? `No results for ${searchInput}`
              : "Can't fetch guilds from the backend right now. Check back later!"
          }
        >
          {filteredGuilds.length &&
            filteredGuilds.map((guild) => (
              <GuildCard key={guild.id} guildData={guild} />
            ))}
        </CategorySection>
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetchGuilds()

  return {
    props: { guilds },
    revalidate: 10,
  }
}

export default Page
