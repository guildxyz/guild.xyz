import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import PageCard from "components/help/pageCard"
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

function CustomLink({
  className,
  href,
  children,
}: PropsWithChildren<CustomPageLinkProps>) {
  const linkId =
    href.slice(1, 9) +
    "-" +
    href.slice(9, 13) +
    "-" +
    href.slice(13, 17) +
    "-" +
    href.slice(17, 21) +
    "-" +
    href.slice(21)

  return (
    <a className={className} href={`/help/${linkId}`}>
      {children}
    </a>
  )
}

async function getAllPages() {
  const { Client } = require("@notionhq/client")

  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const databaseId = process.env.NOTION_DATABASE_ID
  const response = await notion.databases.query({
    database_id: databaseId,
  })
  return response.results
}

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

function getPageLinkDatas(blockMap, params: any, allPages: any) {
  const linkedPageIds = blockMap.block[params.pageId.toString()]?.value.properties[
    "xBM?"
  ]
    ?.filter((link) => link.length > 1)
    .map((linkObj) => linkObj[1][0][1])
  const linkedPageContents = allPages.filter((page) =>
    linkedPageIds?.includes(page.id)
  )
  return linkedPageContents
}

export async function getStaticProps({ params }) {
  const blockMap = await getPage(params)
  const allPages = await getAllPages()
  const linkedPageContents = getPageLinkDatas(blockMap, params, allPages)

  return {
    props: {
      blockMap,
      linkedPageContents,
      params,
    },
  }
}

function Page({ blockMap, linkedPageContents, params }) {
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
        {linkedPageContents && (
          <CategorySection fallbackText={"no tags"}>
            {linkedPageContents?.map((page) => (
              <PageCard pageData={page} key={page.id} echosystem={true} />
            ))}
          </CategorySection>
        )}
      </Layout>
    </>
  )
}

export default Page
