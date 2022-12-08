import { GridItem, SimpleGrid } from "@chakra-ui/react"
import MultiSelect, { FilterOption } from "components/brain/multiSelect"
import PageDetailsCard from "components/brain/pageDetailsCard"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import SearchBar from "components/explorer/SearchBar"
import { GetStaticProps } from "next"
import { useMemo, useState } from "react"
import { PageDetailsCardData } from "types"

type Props = {
  cards: PageDetailsCardData[]
}

const Guildverse = ({ cards: cards }: Props): JSX.Element => {
  const [search, setSearch] = useState<string>("")
  const filterOptions: Array<FilterOption> = [
    { value: "requirement", label: "requirement" },
    { value: "reward", label: "reward" },
    { value: "core", label: "core" },
    { value: "build with Guild", label: "build with Guild" },
    { value: "web2", label: "web2" },
    { value: "web3", label: "web3" },
  ]
  const [filterData, setFilterData] = useState<Array<FilterOption>>([])
  const renderedCards = useMemo(
    () =>
      cards
        .filter((card) =>
          filterData
            .map((filterElement) => filterElement.value)
            .every((filterTag) => card?.tags.includes(filterTag))
        )
        .filter((card) => card.title.toLowerCase().includes(search.toLowerCase())),
    [cards, filterData, search]
  )

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Guildverse" showBackButton={false}>
        <SimpleGrid
          templateColumns={{ md: "2fr 0fr 3fr" }}
          gap={{ base: 2, md: "6" }}
          mb={8}
        >
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <SearchBar placeholder="Search" {...{ search, setSearch }} />
          </GridItem>
          <MultiSelect {...{ filterOptions, setFilterData }} />
        </SimpleGrid>
        <CategorySection fallbackText={"There are no pages"}>
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
    sorts: [
      {
        property: "defaultOrder(1-5)",
        direction: "descending",
      },
    ],
  })

  const cards: Array<PageDetailsCardData> = response.results.map((page) => ({
    id: page.id,
    title: page.properties.title.title[0].plain_text,
    tags: page.properties.tags.multi_select.map((tag) => tag.name),
    icon: page.icon?.file?.url ? page.icon.file.url : null,
    iconBgColor: page.properties.iconBgColor.rich_text[0]?.plain_text
      ? page.properties.iconBgColor.rich_text[0]?.plain_text
      : null,
    backgroundImage: page.cover?.external?.url ? page.cover.external.url : null,
  }))

  return {
    props: { cards },
    revalidate: 10,
  }
}

export default Guildverse
