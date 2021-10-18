import { GridItem, SimpleGrid, Stack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import GroupsGuildsNav from "components/index/GroupsGuildsNav"
import GroupsList from "components/index/GroupsList"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import fetchGroups from "components/index/utils/fetchGroups"
import { GetStaticProps } from "next"
import { useState } from "react"
import useSWR from "swr"
import { Group } from "temporaryData/types"

type Props = {
  groups: Group[]
}

const Page = ({ groups: groupsInitial }: Props): JSX.Element => {
  const { data: groups } = useSWR("groups", fetchGroups, {
    fallbackData: groupsInitial,
  })
  const [searchInput, setSearchInput] = useState("")
  const [orderedGroups, setOrderedGroups] = useState(groups)

  return (
    <Layout
      title="Guildhall"
      description="A place for Web3 guilds"
      imageUrl="/logo.svg"
    >
      <SimpleGrid
        templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
        gap={{ base: 2, md: "6" }}
        mb={16}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <SearchBar placeholder="Search groups" setSearchInput={setSearchInput} />
        </GridItem>
        <OrderSelect {...{ groups, setOrderedGroups }} />
      </SimpleGrid>

      <GroupsGuildsNav />

      <Stack spacing={12}>
        <GroupsList orderedGroups={orderedGroups} searchInput={searchInput} />
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const groups = await fetchGroups()

  return {
    props: { groups },
    revalidate: 10,
  }
}

export default Page
