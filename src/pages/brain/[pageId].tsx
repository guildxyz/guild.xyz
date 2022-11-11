import { Link } from "@chakra-ui/react"
import PageDetailsCard from "components/brain/pageDetailsCard"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import { GetStaticPaths } from "next"
import { NotionAPI } from "notion-client"
import { PropsWithChildren } from "react"
import { NotionRenderer } from "react-notion-x"
import { Collection } from "react-notion-x/build/third-party/collection"
import "react-notion-x/src/styles.css"
import { PageDetailsCardData } from "types"

type CustomPageLinkProps = {
  href: string
  children: any
}

function CustomLink({ href, children }: PropsWithChildren<CustomPageLinkProps>) {
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
    <Link href={`/brain/${linkId}`} colorScheme={"blue"} fontWeight="medium">
      {children.props.block.properties.title[0][0]}
    </Link>
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
  const pages = await getAllPages()
  const ids = pages.map((page) => JSON.parse(`{"params":{"pageId":"${page.id}"}}`))
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

  const cards: Array<PageDetailsCardData> = links.map((page) => ({
    id: page.id,
    title: page.properties.title.title[0].plain_text,
    tags: page.properties.tags.multi_select.map((tag) => tag.name),
    icon: page.icon?.file?.url ? page.icon.file.url : null,
  }))
  return cards
}

const getLinkedPagesByTags = (blockMap, params, allPages) => {
  const linkedTags =
    blockMap.block[params.pageId.toString()]?.value.properties["~Ogv"][0][0].split(
      ","
    )

  const linkedPagesByTags = allPages.filter(
    (page) =>
      page.properties.relatedContentsByTags.multi_select
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

function PageDetails({ blockMap, linkedPageContents, params }) {
  return (
    <>
      <LinkPreviewHead path="" />
      <Layout
        title={
          blockMap.block[params.pageId.toString()]?.value.properties.title[0][0]
        }
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
              <PageDetailsCard pageData={page} key={page.id} />
            ))}
          </CategorySection>
        )}
      </Layout>
    </>
  )
}

export default PageDetails
