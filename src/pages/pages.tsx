import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import PageCard from "components/help/pageCard"

export async function getStaticProps() {
  const { Client } = require("@notionhq/client")

  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const databaseId = process.env.NOTION_DATABASE_ID
  const response = await notion.databases.query({
    database_id: databaseId,
  })
  const pages = response.results // TODO: map results to PageCardBase list
  return {
    props: {
      pages,
    },
  }
}

function Page({ pages }) {
  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="DB list" description="dummytummy" showBackButton={false}>
        <CategorySection fallbackText={"There are no pages"}>
          {pages.map((page) => (
            <PageCard pageData={page} key={page.id} />
          ))}
        </CategorySection>
      </Layout>
    </>
  )
}

export default Page
