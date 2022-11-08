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
  // TODO: nice format to link
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

function CustomCollection(props) {
  // return <div>f2</div>
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

async function getLinks(blockMap, params: any) {
  const allPages = await getAllPages()
  const linkedPageContents = getLinkedPages(blockMap, params, allPages)
  const linkedPagesByTags = getLinkedPagesByTags(blockMap, params, allPages)
  const links = [...new Set([...linkedPageContents, ...linkedPagesByTags])]
  console.log(links)

  return links
}

const getLinkedPagesByTags = (blockMap, params, allPages) => {
  const linkedTags =
    blockMap.block[params.pageId.toString()]?.value.properties["aY]V"][0][0].split(
      ","
    )

  const linkedPagesByTags = allPages.filter(
    (page) =>
      page.properties.relatedcontentsbytags.multi_select
        .map((tagObject) => tagObject.name)
        .some((tag) => linkedTags.includes(tag)) && page.id !== params.pageId
  )

  return linkedPagesByTags
}

function getLinkedPages(blockMap: any, params: any, allPages: any) {
  const linkedPageIds = blockMap.block[params.pageId.toString()]?.value.properties[
    "xBM?"
  ]
    ?.filter((link) => link.length > 1)
    .map((linkObj) => linkObj[1][0][1])
  const linkedPageContents = allPages.filter(
    (page) => linkedPageIds?.includes(page.id) && page.id !== params.pageId
  )
  return linkedPageContents
}

export async function getStaticProps({ params }) {
  const blockMap = await getPage(params)
  const linkedPageContents = await getLinks(blockMap, params)

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
