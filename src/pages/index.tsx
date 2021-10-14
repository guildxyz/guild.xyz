import {
  GridItem,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
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
  const [tabIndex, setTabIndex] = useState(0)
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
      <SimpleGrid
        templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
        gap={{ base: 2, md: "6" }}
        mb={16}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <SearchBar
            placeholder={`Search ${tabIndex === 0 ? "guilds" : "groups"}`}
            setSearchInput={setSearchInput}
          />
        </GridItem>
        <OrderSelect {...{ guilds, setOrderedGuilds }} />
      </SimpleGrid>

      <Tabs variant="unstyled" index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab
            mr={2}
            py={1}
            borderColor="gray.700"
            borderWidth={2}
            borderRadius="xl"
            _selected={{ bgColor: "gray.700" }}
          >
            Guilds
          </Tab>
          <Tab
            py={1}
            borderColor="gray.700"
            borderWidth={2}
            borderRadius="xl"
            _selected={{ bgColor: "gray.700" }}
          >
            Groups
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0} py={8}>
            <Stack spacing={12}>
              <GuildsList orderedGuilds={orderedGuilds} searchInput={searchInput} />
            </Stack>
          </TabPanel>
          <TabPanel px={0} py={8}>
            <Stack spacing={12}>
              <GroupsList orderedGroups={orderedGroups} searchInput={searchInput} />
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
