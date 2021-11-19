import { GridItem, SimpleGrid, Stack, Tag, useColorMode } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import ExplorerCardMotionWrapper from "components/common/ExplorerCardMotionWrapper"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import HallsGuildsNav from "components/index/HallsGuildsNav"
import useFilteredData from "components/index/hooks/useFilteredData"
import useOrder from "components/index/hooks/useOrder"
import useUsersHallsGuilds from "components/index/hooks/useUsersHallsGuilds"
import useUsersHallsGuildsIds from "components/index/hooks/useUsersHallsGuildsIds"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import useLocalStorage from "hooks/useLocalStorage"
import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Guild } from "temporaryData/types"
import fetchApi from "utils/fetchApi"

type Props = {
  guilds: Guild[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { data: guilds } = useSWR<Array<Guild>>("/guild", {
    fallbackData: guildsInitial,
  })
  const [searchInput, setSearchInput] = useState("")
  const [order, setOrder] = useLocalStorage("order", "most members")

  const { usersGuildsIds } = useUsersHallsGuildsIds()
  const usersGuilds = useUsersHallsGuilds(guilds, usersGuildsIds)

  const orderedGuilds = useOrder(guilds, order)
  const orderedUsersGuilds = useOrder(usersGuilds, order)

  const [filteredGuilds, filteredUsersGuilds] = useFilteredData(
    orderedGuilds,
    orderedUsersGuilds,
    searchInput
  )

  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  return (
    <Layout
      title="Guild"
      description="A place for Web3 guilds"
      imageUrl="/guildLogos/logo.svg"
      imageBg="transparent"
    >
      <SimpleGrid
        templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
        gap={{ base: 2, md: "6" }}
        mb={16}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <SearchBar placeholder="Search guilds" setSearchInput={setSearchInput} />
        </GridItem>
        <OrderSelect {...{ order, setOrder }} />
      </SimpleGrid>

      <HallsGuildsNav />

      <Stack spacing={12}>
        <CategorySection
          title={
            usersGuilds.length ? "Your guilds" : "You're not part of any guilds yet"
          }
          fallbackText={`No results for ${searchInput}`}
        >
          {orderedUsersGuilds.length ? (
            filteredUsersGuilds.length &&
            filteredUsersGuilds
              .map((guild) => (
                <ExplorerCardMotionWrapper key={guild.id}>
                  <GuildCard guildData={guild} />
                </ExplorerCardMotionWrapper>
              ))
              .concat(
                <ExplorerCardMotionWrapper key="create-guild">
                  <AddCard text="Create guild" link="/create-guild" />
                </ExplorerCardMotionWrapper>
              )
          ) : (
            <ExplorerCardMotionWrapper key="create-guild">
              <AddCard text="Create guild" link="/create-guild" />
            </ExplorerCardMotionWrapper>
          )}
        </CategorySection>

        <CategorySection
          title="All guilds"
          titleRightElement={<Tag size="sm">{filteredGuilds.length}</Tag>}
          fallbackText={
            orderedGuilds.length
              ? `No results for ${searchInput}`
              : "Can't fetch guilds from the backend right now. Check back later!"
          }
        >
          {filteredGuilds.length &&
            filteredGuilds.map((guild) => (
              <ExplorerCardMotionWrapper key={guild.id}>
                <GuildCard guildData={guild} />
              </ExplorerCardMotionWrapper>
            ))}
        </CategorySection>
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetchApi("/guild")

  return {
    props: { guilds },
    revalidate: 10,
  }
}

export default Page
