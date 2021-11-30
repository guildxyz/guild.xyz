import { GridItem, SimpleGrid, Stack, Tag, useColorMode } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Layout from "components/common/Layout"
import CategorySection from "components/index/CategorySection"
import HallCard from "components/index/HallCard"
import useFilteredData from "components/index/hooks/useFilteredData"
import useOrder from "components/index/hooks/useOrder"
import useUsersHallsGuilds from "components/index/hooks/useUsersHallsGuilds"
import useUsersHallsGuildsIds from "components/index/hooks/useUsersHallsGuildsIds"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import useLocalStorage from "hooks/useLocalStorage"
import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Hall } from "temporaryData/types"
import fetchApi from "utils/fetchApi"

type Props = {
  halls: Hall[]
}

const Page = ({ halls: hallsInitial }: Props): JSX.Element => {
  const { data: halls } = useSWR("/group", {
    fallbackData: hallsInitial,
  })
  const [searchInput, setSearchInput] = useState("")
  const [order, setOrder] = useLocalStorage("order", "most members")

  const { usersHallsIds } = useUsersHallsGuildsIds()
  const usersHalls = useUsersHallsGuilds(halls, usersHallsIds)

  const orderedHalls = useOrder(halls, order)
  const orderedUsersHalls = useOrder(usersHalls, order)

  const [filteredHalls, filteredUsersHalls] = useFilteredData(
    orderedHalls,
    orderedUsersHalls,
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
          <SearchBar
            placeholder="Search guildhalls"
            setSearchInput={setSearchInput}
          />
        </GridItem>
        <OrderSelect {...{ order, setOrder }} />
      </SimpleGrid>

      <Stack spacing={12}>
        <CategorySection
          title={
            usersHalls.length
              ? "Your guildhalls"
              : "You're not part of any guildhalls yet"
          }
          fallbackText={`No results for ${searchInput}`}
        >
          {orderedUsersHalls.length ? (
            filteredUsersHalls.length &&
            filteredUsersHalls
              .map((hall) => (
                // <ExplorerCardMotionWrapper key={hall.id}>
                <HallCard key={hall.id} hallData={hall} />
                // </ExplorerCardMotionWrapper>
              ))
              .concat(
                // <ExplorerCardMotionWrapper key="create-guild">
                <AddCard
                  key="create-guild"
                  text="Create guildhall"
                  link="/create-guild"
                />
                // </ExplorerCardMotionWrapper>
              )
          ) : (
            // <ExplorerCardMotionWrapper key="create-guild">
            <AddCard
              key="create-guild"
              text="Create guildhall"
              link="/create-guild"
            />
            // </ExplorerCardMotionWrapper>
          )}
        </CategorySection>
        <CategorySection
          title="All guildhalls"
          titleRightElement={<Tag size="sm">{filteredHalls.length}</Tag>}
          fallbackText={
            orderedHalls.length
              ? `No results for ${searchInput}`
              : "Can't fetch guildhalls from the backend right now. Check back later!"
          }
        >
          {filteredHalls.length &&
            filteredHalls.map((hall) => (
              // <ExplorerCardMotionWrapper key={hall.id}>
              <HallCard key={hall.id} hallData={hall} />
              // </ExplorerCardMotionWrapper>
            ))}
        </CategorySection>
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const halls = await fetchApi("/group")

  return {
    props: { halls },
    revalidate: 10,
  }
}

export default Page
