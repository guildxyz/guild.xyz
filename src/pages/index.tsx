import { HStack, Stack, Tag, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import useUsersGuilds from "components/index/hooks/useUsersGuilds"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import fetchGuilds from "components/index/utils/fetchGuilds"
import { GetStaticProps } from "next"
import { useMemo, useState } from "react"
import useSWR from "swr"
import { Guild } from "temporaryData/types"

type Props = {
  guilds: Guild[]
}

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { data: guilds } = useSWR("guilds", fetchGuilds, {
    fallbackData: guildsInitial,
  })
  const { account } = useWeb3React()
  const usersGuildsIds = useUsersGuilds()
  const [searchInput, setSearchInput] = useState("")
  const [orderedGuilds, setOrderedGuilds] = useState(guilds)

  const usersGuilds = useMemo(
    () =>
      orderedGuilds.filter(
        ({ id, owner: { addresses } }) =>
          usersGuildsIds?.includes(id) ||
          addresses.map((user) => user.address).includes(account?.toLowerCase())
      ),
    [orderedGuilds, usersGuildsIds, account]
  )

  const filteredGuilds = useMemo(
    () => orderedGuilds.filter(({ name }) => filterByName(name, searchInput)),
    [orderedGuilds, searchInput]
  )

  const filteredUsersGuilds = useMemo(
    () => usersGuilds.filter(({ name }) => filterByName(name, searchInput)),
    [usersGuilds, searchInput]
  )

  return (
    <Layout
      title="Guildhall"
      description="A place for Web3 guilds"
      imageUrl="/logo.svg"
    >
      <Stack direction="row" spacing="6">
        <SearchBar setSearchInput={setSearchInput} />
        <OrderSelect {...{ guilds, setOrderedGuilds }} />
      </Stack>
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
              <Tag colorScheme="alpha" size="sm">
                {filteredGuilds.length}
              </Tag>
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
