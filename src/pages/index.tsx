import { Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
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
    <Layout title="Guildhall" description="A place for Web3 guilds">
      <SearchBar setSearchInput={setSearchInput} />
      <Stack spacing={12}>
        <CategorySection
          title="Your guilds"
          fallback={
            usersGuilds.length ? (
              <Text>{`No results for ${searchInput}`}</Text>
            ) : (
              <Text>
                You're not part of any guilds yet.{" "}
                <Link href="/create-guild" colorScheme="green">
                  Create your own
                </Link>
              </Text>
            )
          }
        >
          {filteredUsersGuilds.length &&
            filteredUsersGuilds
              .map((guild) => <GuildCard key={guild.id} guildData={guild} />)
              .concat(<AddCard text="Create guild" link="/create-guild" />)}
        </CategorySection>
        <CategorySection
          title="All guilds"
          fallback={<Text>{`No results for ${searchInput}`}</Text>}
        >
          {filteredGuilds.map((guild) => (
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
