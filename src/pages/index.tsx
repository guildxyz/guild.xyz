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
import useUsersGuilds from "components/index/hooks/useUsersGuilds"
import useUsersGuildsRolesIds from "components/index/hooks/useUsersGuildsRolesIds"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import { GetStaticProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Guild } from "temporaryData/types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: Guild[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const router = useRouter()

  const { data: guilds } = useSWR(`/guild?sort=${router.query.order || "members"}`, {
    fallbackData: guildsInitial,
  })

  const { usersGuildsIds } = useUsersGuildsRolesIds()
  const usersGuilds = useUsersGuilds(guilds, usersGuildsIds)

  const [searchInput, setSearchInput] = useState("")

  const [filteredGuilds, filteredUsersGuilds] = useFilteredData(
    guilds,
    usersGuilds,
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
        <OrderSelect />
      </SimpleGrid>

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
            guilds.length
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
