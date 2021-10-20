import { GridItem, HStack, SimpleGrid, Stack, Tag, Text } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import GroupCard from "components/index/GroupCard"
import GroupsGuildsNav from "components/index/GroupsGuildsNav"
import useFilteredData from "components/index/hooks/useFilteredData"
import useUsersGroupsGuilds from "components/index/hooks/useUsersGroupsGuilds"
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

  const { usersGroupsIds } = useUsersGroupsGuilds()
  const [usersGroups, filteredGroups, filteredUsersGroups] = useFilteredData(
    orderedGroups,
    usersGroupsIds,
    searchInput
  )

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
        <OrderSelect data={groups} setOrderedData={setOrderedGroups} />
      </SimpleGrid>

      <GroupsGuildsNav />

      <Stack spacing={12}>
        <CategorySection
          title={
            usersGroups.length ? "Your groups" : "You're not part of any groups yet"
          }
          fallbackText={`No results for ${searchInput}`}
        >
          {usersGroups.length ? (
            filteredUsersGroups.length &&
            filteredUsersGroups
              .map((group) => <GroupCard key={group.id} groupData={group} />)
              .concat(
                <AddCard
                  key="create-group"
                  text="Create group"
                  link="/create-group"
                />
              )
          ) : (
            <AddCard text="Create group" link="/create-group" />
          )}
        </CategorySection>
        <CategorySection
          title={
            <HStack spacing={2} alignItems="center">
              <Text as="span">All groups</Text>
              <Tag size="sm">{filteredGroups.length}</Tag>
            </HStack>
          }
          fallbackText={
            orderedGroups.length
              ? `No results for ${searchInput}`
              : "Can't fetch groups from the backend right now. Check back later!"
          }
        >
          {filteredGroups.length &&
            filteredGroups.map((group) => (
              <GroupCard key={group.id} groupData={group} />
            ))}
        </CategorySection>
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
