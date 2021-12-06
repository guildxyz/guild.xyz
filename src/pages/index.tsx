import {
  Box,
  GridItem,
  SimpleGrid,
  Stack,
  Tag,
  useColorMode,
} from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import useFilteredData from "components/index/hooks/useFilteredData"
import useOrder from "components/index/hooks/useOrder"
import useUsersGuilds from "components/index/hooks/useUsersGuilds"
import useUsersGuildsRolesIds from "components/index/hooks/useUsersGuildsRolesIds"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import useLocalStorage from "hooks/useLocalStorage"
import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Guild } from "temporaryData/types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: Guild[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { data: guilds } = useSWR("/guild", {
    fallbackData: guildsInitial,
  })
  const [searchInput, setSearchInput] = useState("")
  const [order, setOrder] = useLocalStorage("order", "most members")

  const { usersGuildsIds } = useUsersGuildsRolesIds()
  const usersGuilds = useUsersGuilds(guilds, usersGuildsIds)

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
                // <ExplorerCardMotionWrapper key={guild.id}>
                <Box key={guild.id}>
                  <GuildCard guildData={guild} />
                </Box>
                // </ExplorerCardMotionWrapper>
              ))
              .concat(
                // <ExplorerCardMotionWrapper key="create-guild">
                <Box key="create-guild">
                  <AddCard text="Create guild" link="/create-guild" />
                </Box>
                // </ExplorerCardMotionWrapper>
              )
          ) : (
            // <ExplorerCardMotionWrapper key="create-guild">
            <Box key="create-guild">
              <AddCard text="Create guild" link="/create-guild" />
            </Box>
            // </ExplorerCardMotionWrapper>
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
              // <ExplorerCardMotionWrapper key={guild.id}>
              <Box key={guild.id}>
                <GuildCard guildData={guild} />
              </Box>
              // </ExplorerCardMotionWrapper>
            ))}
        </CategorySection>
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetcher(`/guild`).catch((_) => [])

  return {
    props: { guilds },
    revalidate: 10,
  }
}

export default Page
