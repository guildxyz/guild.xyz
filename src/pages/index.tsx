import { InputGroup, InputLeftAddon } from "@chakra-ui/input"
import { Stack } from "@chakra-ui/react"
import { Select } from "@chakra-ui/select"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import useUsersGuilds from "components/index/hooks/useUsersGuilds"
import SearchBar from "components/index/SearchBar"
import fetchGuilds from "components/index/utils/fetchGuilds"
import { GetStaticProps } from "next"
import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { Guild } from "temporaryData/types"

type Props = {
  guilds: Guild[]
}

const ordering = {
  name: (a: Guild, b: Guild) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  },
  oldest: (a: Guild, b: Guild) => a.id - b.id,
  newest: (a: Guild, b: Guild) => b.id - a.id,
  "least members": (a: Guild, b: Guild) =>
    a.levels[0].membersCount - b.levels[0].membersCount,
  "most members": (a: Guild, b: Guild) =>
    b.levels[0].membersCount - a.levels[0].membersCount,
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
  const [order, setOrder] = useState("newest")

  useEffect(() => {
    setOrderedGuilds(guilds.sort(ordering[order]))
  }, [guilds, order])

  const usersGuilds = useMemo(
    () =>
      guilds.filter(
        ({ id, owner: { addresses } }) =>
          usersGuildsIds?.includes(id) ||
          addresses.map((user) => user.address).includes(account?.toLowerCase())
      ),
    [guilds, usersGuildsIds, account]
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
    <Layout title="Guildhall" description="A place for Web3 guilds">
      <Stack direction="row" spacing="6">
        <SearchBar setSearchInput={setSearchInput} />
        {/* <OrderSelect {...{ guilds, setOrderedGuilds, orderedGuilds }} /> */}
        <InputGroup size="lg" maxW="300px">
          <InputLeftAddon bg="gray.700">Order by</InputLeftAddon>
          <Select
            borderLeftRadius="0"
            onChange={(e) => setOrder(e.target.value)}
            value={order}
          >
            {Object.keys(ordering).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </InputGroup>
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
          title="All guilds"
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
