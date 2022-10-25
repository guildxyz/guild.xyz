import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import { GetStaticPaths } from "next"
import { NotionRenderer } from "react-notion"

async function getIds() {
  const { Client } = require("@notionhq/client")

  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const databaseId = process.env.NOTION_DATABASE_ID

  const response = await notion.databases.query({
    database_id: databaseId,
  })

  const ids = response.results.map((page) =>
    JSON.parse(`{"params":{"pageId":"${page.id}"}}`)
  )

  return ids
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const paths = await getIds()

  return {
    paths,
    fallback: "blocking",
  }
}

export async function getStaticProps({ params }) {
  const blockMap = await fetch(
    `https://notion-api.splitbee.io/v1/page/${params.pageId.toString()}`
  ).then((res) => res.json())

  return {
    props: {
      blockMap,
      params,
    },
  }
}

function Page({ blockMap, params }) {
  return (
    <>
      <LinkPreviewHead path="" />
      <Layout
        title={blockMap[params?.pageId.toString()]?.value.properties.title[0][0]}
        description="dummytummy"
        showBackButton={false}
      >
        <NotionRenderer blockMap={blockMap} hideHeader={true} />
      </Layout>
    </>
  )
}

export default Page
