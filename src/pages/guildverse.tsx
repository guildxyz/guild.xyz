import { SimpleGrid } from "@chakra-ui/react"
import BrainCard from "components/brain/BrainCard"
import FilterSelect, { FilterOption } from "components/brain/FilterSelect"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import SearchBar from "components/explorer/SearchBar"
import { GetStaticProps } from "next"
import { useMemo, useState } from "react"
import { BrainCardData } from "types"

type Props = {
  cards: BrainCardData[]
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
      cards.filter(
        (card) =>
          filterData.every((filterTag) => card?.tags.includes(filterTag.value)) &&
          card.title.toLowerCase().includes(search.toLowerCase())
      ),
    [cards, filterData, search]
  )

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Guildverse" showBackButton={false}>
        <SimpleGrid
          templateColumns={{ md: "2fr 3fr" }}
          gap={{ base: 2, md: "6" }}
          mb={8}
        >
          <SearchBar placeholder="Search" {...{ search, setSearch }} />
          <FilterSelect {...{ filterOptions, setFilterData }} />
        </SimpleGrid>
        <CategorySection fallbackText={"There are no pages"}>
          {renderedCards.map((card) => (
            <BrainCard pageData={card} key={card.id} />
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
      and: [
        {
          property: "kind",
          select: {
            equals: "ecosystem",
          },
        },
        {
          property: "visibility",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: "defaultOrder",
        direction: "ascending",
      },
    ],
  })

  const cards: Array<BrainCardData> = response.results.map((page) => ({
    id: page.id,
    title: page.properties.title.title[0].plain_text,
    tags: page.properties.tags.multi_select.map((tag) => tag.name),
    icon: page.icon?.file?.url ?? null,
    backgroundImage: page.cover?.file?.url ?? null,
  }))

  return {
    props: { cards },
    revalidate: 10,
  }
}

export default Guildverse
