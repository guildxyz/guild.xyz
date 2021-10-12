import { Stack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import GroupsList from "components/index/GroupsList"
import GuildsList from "components/index/GuildsList"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import fetchGuilds from "components/index/utils/fetchGuilds"
import { GetStaticProps } from "next"
import { useState } from "react"
import useSWR from "swr"
// TEMP
import groups from "temporaryData/groups"
import { Group, Guild } from "temporaryData/types"

type Props = {
  groups: Group[]
  guilds: Guild[]
}

const Page = ({
  groups: groupsInitial,
  guilds: guildsInitial,
}: Props): JSX.Element => {
  const { data: guilds } = useSWR("guilds", fetchGuilds, {
    fallbackData: guildsInitial,
  })
  const [searchInput, setSearchInput] = useState("")
  const [orderedGuilds, setOrderedGuilds] = useState(guilds)
  // TODO: fetch groups (SWR)
  // TODO: ordering for groups too
  const [orderedGroups, setOrderedGroups] = useState(groupsInitial)

  return (
    <Layout
      title="Guildhall"
      description="A place for Web3 guilds"
      imageUrl="/logo.svg"
    >
      <Stack direction="row" spacing={{ base: 2, md: "6" }} mb={16}>
        <SearchBar setSearchInput={setSearchInput} />
        <OrderSelect {...{ guilds, setOrderedGuilds }} />
      </Stack>
      <Stack spacing={12}>
        <GroupsList orderedGroups={orderedGroups} searchInput={searchInput} />
        <GuildsList orderedGuilds={orderedGuilds} searchInput={searchInput} />
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetchGuilds()

  return {
    props: { guilds, groups },
    revalidate: 10,
  }
}

export default Page
