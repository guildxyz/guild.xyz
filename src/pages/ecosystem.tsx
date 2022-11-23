import { GridItem, SimpleGrid, usePrevious } from "@chakra-ui/react"
import MultiSelect, { FilterOption } from "components/brain/multiSelect"
import PageDetailsCard from "components/brain/pageDetailsCard"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import SearchBar from "components/explorer/SearchBar"
import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import { PageDetailsCardData } from "types"

const searchByTitle = (cards: Array<PageDetailsCardData>, searchText: string) =>
  cards.filter((card) => card.title.toLowerCase().includes(searchText.toLowerCase()))

function Ecosystem({ cards }) {
  const [search, setSearch] = useState<string>("")
  const [renderedCards, setCard] = useState(cards)
  const prevSearch = usePrevious(search)
  const [filter, setFilter] = useState<Array<FilterOption>>([
    { value: "requirement", label: "requirement" },
    { value: "reward", label: "reward" },
    { value: "core", label: "core" },
    { value: "build with Guild", label: "build with Guild" },
    { value: "web2", label: "web2" },
    { value: "web3", label: "web3" },
  ])

  const filterPages = (filterData: Array<FilterOption>) => {
    const filteredCards = cards.filter((card) =>
      filterData
        .map((filterElement) => filterElement.value)
        .every((filterTag) => card.tags.includes(filterTag))
    )
    setCard(filteredCards)
  }

  useEffect(() => {
    if (prevSearch === search || prevSearch === undefined) return
    setCard(searchByTitle(cards, search))
  }, [prevSearch, search, cards])

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Ecosystem" showBackButton={false}>
        <SimpleGrid
          templateColumns={{ base: "auto 50px", md: "1fr 1fr 3fr" }}
          gap={{ base: 2, md: "6" }}
          mb={16}
        >
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <SearchBar placeholder="Search guilds" {...{ search, setSearch }} />
          </GridItem>
          <MultiSelect {...{ filter, setFilter, filterPages }} />
        </SimpleGrid>

        <CategorySection fallbackText={"There are no pages"} mt="32px">
          {renderedCards.map((card) => (
            <PageDetailsCard pageData={card} key={card.id} />
          ))}
        </CategorySection>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { Client } = require("@notionhq/client")
  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const databaseId = process.env.NOTION_DATABASE_ID
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "kind",
      select: {
        equals: "ecosystem",
      },
    },
  })

  const cards: Array<PageDetailsCardData> = response.results.map((page) => ({
    id: page.id,
    title: page.properties.title.title[0].plain_text,
    tags: page.properties.tags.multi_select.map((tag) => tag.name),
    icon: page.icon?.file?.url ? page.icon.file.url : null,
  }))

  return {
    props: { cards },
    revalidate: 10,
  }
}

export default Ecosystem
