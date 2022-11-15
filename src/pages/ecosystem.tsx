import PageDetailsCard from "components/brain/pageDetailsCard"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import { GetStaticProps } from "next"
import { PageDetailsCardData } from "types"
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
  }
}

function Ecosystem({ cards }) {
  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Ecosystem" showBackButton={false}>
        <CategorySection fallbackText={"There are no pages"}>
          {cards.map((card) => (
            <PageDetailsCard pageData={card} key={card.id} />
          ))}
        </CategorySection>
      </Layout>
    </>
  )
}

export default Ecosystem
