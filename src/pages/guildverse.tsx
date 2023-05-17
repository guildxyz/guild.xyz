import { DarkMode, SimpleGrid } from "@chakra-ui/react"
import BrainCard from "components/brain/BrainCard"
import FilterSelect, { FilterOption } from "components/brain/FilterSelect"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import SearchBar from "components/explorer/SearchBar"
import { GetServerSideProps } from "next"
import { useMemo, useState } from "react"
import { BrainCardData } from "types"

type Props = {
  cards: BrainCardData[]
}

export const filterOptions: Array<FilterOption> = [
  { value: "requirement", label: "requirement" },
  { value: "reward", label: "reward" },
  { value: "built with Guild", label: "built with Guild" },
  { value: "web2", label: "web2" },
  { value: "web3", label: "web3" },
]

const Guildverse = ({ cards: cards }: Props): JSX.Element => {
  const [search, setSearch] = useState<string>("")
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
      <DarkMode>
        <Layout title="Guildverse">
          <SimpleGrid
            templateColumns={{ md: "2fr 3fr" }}
            gap={{ base: 2, md: 6 }}
            mb={8}
          >
            <SearchBar placeholder="Search" {...{ search, setSearch }} />
            <FilterSelect setFilterData={setFilterData} />
          </SimpleGrid>
          <GuildCardsGrid>
            {renderedCards.map((card) => (
              <BrainCard pageData={card} key={card.id} />
            ))}
          </GuildCardsGrid>
        </Layout>
      </DarkMode>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=600")

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

  const cards: Array<BrainCardData> = response.results
    .map((page) => ({
      id: page.id,
      title: page.properties.title.title[0]?.plain_text ?? "",
      tags: page.properties.tags.multi_select.map((tag) => tag.name),
      icon: page.icon?.file?.url ?? null,
      backgroundImage: page.cover?.file?.url ?? null,
    }))
    .filter((card) => card.title !== "")

  return {
    props: { cards },
  }
}

export default Guildverse
