import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import { GetStaticPaths } from "next"
import { NotionAPI } from "notion-client"
import "prismjs/themes/prism-tomorrow.css"
import { NotionRenderer } from "react-notion-x"
import { Collection } from "react-notion-x/build/third-party/collection"

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
  const blockMap = await getPage(params)

  return {
    props: {
      blockMap,
      params,
    },
  }
}

async function getPage(params: any) {
  const notion = new NotionAPI()
  const blockMap = await notion.getPage(params.pageId.toString())
  return blockMap
}

function Page({ blockMap, params }) {
  return (
    <>
      <LinkPreviewHead path="" />
      <Layout
        title={blockMap.block[params.pageId.toString()].value.properties.title[0][0]}
        description="dummytummy"
        showBackButton={false}
      >
        <NotionRenderer
          recordMap={blockMap}
          components={{
            Collection,
          }}
        />
      </Layout>
    </>
  )
}

export default Page
