import { HStack, Stack, Tag, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import useUsersGuilds from "components/index/hooks/useUsersGuilds"
import SearchBar from "components/index/SearchBar"
import fetchGuilds from "components/index/utils/fetchGuilds"
import { GetStaticProps } from "next"
import { useMemo, useState } from "react"
import useSWR from "swr"
import { Guild } from "temporaryData/types"

type Props = {
  guilds: Guild[]
}

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { data: guilds } = useSWR("guilds", fetchGuilds, {
    fallbackData: guildsInitial,
  })
  const { account } = useWeb3React()
  const usersGuildsIds = useUsersGuilds()
  const [searchInput, setSearchInput] = useState("")

  const usersGuilds = useMemo(
    () =>
      guilds.filter(
        ({ id, owner: { addresses } }) =>
          usersGuildsIds?.includes(id) ||
          addresses.map((user) => user.address).includes(account?.toLowerCase())
      ),
    [guilds, usersGuildsIds, account]
  )

  const filterByName = ({ name }: { name: any }): any =>
    name.toLowerCase().includes(searchInput.toLowerCase())

  const filteredGuilds = useMemo(
    () => guilds.filter(filterByName),
    [guilds, searchInput]
  )

  const filteredUsersGuilds = useMemo(
    () => usersGuilds.filter(filterByName),
    [usersGuilds, searchInput]
  )

  return (
    <Layout
      title="Guildhall"
      description="A place for Web3 guilds"
      imageUrl="/logo.svg"
    >
      <SearchBar setSearchInput={setSearchInput} />
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
            <HStack spacing={2} alignItems="end">
              <Text as="span">All guilds</Text>
              <Tag size="sm">{filteredGuilds.length}</Tag>
            </HStack>
          }
          fallbackText={`No results for ${searchInput}`}
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
