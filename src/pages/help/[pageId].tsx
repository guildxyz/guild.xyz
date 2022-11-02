import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import { GetStaticPaths } from "next"
import { NotionAPI } from "notion-client"
import "prismjs/themes/prism-tomorrow.css"
import { PropsWithChildren } from "react"
import { NotionRenderer } from "react-notion-x"
import { Collection } from "react-notion-x/build/third-party/collection"

type CustomPageLinkProps = {
  href: string
  className: string
}

const CustomLink = ({
  className,
  href,
  children,
}: PropsWithChildren<CustomPageLinkProps>) => (
  <a
    className={className}
    href={`/help${
      href.slice(0, 9) +
      "-" +
      href.slice(9, 13) +
      "-" +
      href.slice(13, 17) +
      "-" +
      href.slice(17, 21) +
      "-" +
      href.slice(21)
    }`}
  >
    {children}
  </a>
)

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

async function getPage(params: any) {
  const notion = new NotionAPI()
  const blockMap = await notion.getPage(params.pageId.toString())
  return blockMap
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

function Page({ blockMap, params }) {
  return (
    <>
      <LinkPreviewHead path="" />
      <Layout
        title={
          blockMap.block[params.pageId.toString()]?.value.properties.title[0][0]
        }
        description="dummytummy"
        showBackButton={false}
      >
        <NotionRenderer
          recordMap={blockMap}
          components={{
            Collection,
            PageLink: CustomLink,
          }}
        />
      </Layout>
    </>
  )
}

export default Page
