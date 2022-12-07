import {
  Button,
  Image,
  Img,
  Link,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
} from "@chakra-ui/react"
import PageDetailsCard from "components/brain/pageDetailsCard"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import Section from "components/common/Section"
import CategorySection from "components/explorer/CategorySection"
import { GetStaticPaths } from "next"
import { NotionAPI } from "notion-client"
import { DiscordLogo, Globe, IconProps, TwitterLogo } from "phosphor-react"

import { PropsWithChildren } from "react"
import { NotionRenderer } from "react-notion-x"
import "react-notion-x/src/styles.css"
import { PageDetailsCardData } from "types"

type CustomPageLinkProps = {
  href: string
  children: any
}

type GuildLinks = {
  name: string
  url: string
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
}

const CustomLink = ({ href, children }: PropsWithChildren<CustomPageLinkProps>) => {
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

const Header = (props) => {
  const tags = props?.block?.properties?.["`SJU"]?.[0]?.[0]
    .split(",")
    .filter((tag) => tag !== "")
  const guildId = props?.block?.properties?.JqtI?.[0]?.[0]
  const websiteURL = props?.block?.properties?.uRBq?.[0]?.[0]
  const twitterURL = props?.block?.properties?.["ByX="]?.[0]?.[0]
  const discordURL = props?.block?.properties?.["Uw?a"]?.[0]?.[0]
  const isContentTypePage = props?.block?.properties?.KYWu?.[0]?.[0] === "content"

  if (
    (tags === undefined || tags.length === 0) &&
    guildId === undefined &&
    websiteURL === undefined &&
    twitterURL === undefined &&
    discordURL === undefined
  )
    return
  if (isContentTypePage) return

  const links: Array<GuildLinks> = [
    { name: "Guild", url: guildId },
    { name: "website", url: websiteURL, icon: Globe },
    { name: "Twitter", url: twitterURL, icon: TwitterLogo },
    { name: "Discord", url: discordURL, icon: DiscordLogo },
  ].filter((link) => link.url !== undefined)

  return (
    <Section mb="16px">
      <Wrap justify="space-between" alignItems="center" spacing="16px">
        <Wrap zIndex="1">
          {links?.map((link, index) => (
            <Link
              key={index}
              href={link.name !== "Guild" ? link.url : `/${link.url}`}
              isExternal={link.name !== "Guild"}
            >
              <Button colorScheme="alpha" color="whiteAlpha.900" height={8}>
                {link.name === "Guild" ? (
                  <Img src="/guildLogos/logo.svg" w="16px" mr="8px"></Img>
                ) : (
                  <TagLeftIcon as={link.icon} />
                )}
                {link.name}
              </Button>
            </Link>
          ))}
        </Wrap>
        <Wrap zIndex="1">
          {tags?.map((tag, index) => (
            <Tag as="li" key={index}>
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </Wrap>
      </Wrap>
    </Section>
  )
}

const PageDetails = ({ blockMap, linkedPageContents, params, pageLogo }) => (
  <>
    <LinkPreviewHead path="" />
    <Layout
      title={blockMap.block[params.pageId.toString()]?.value.properties.title[0][0]}
      image={
        pageLogo ? (
          <Image src={pageLogo} width="56px" mt="8px" alt="page logo"></Image>
        ) : null
      }
    >
      <NotionRenderer
        recordMap={blockMap}
        components={{
          Collection: Header,
          PageLink: CustomLink,
        }}
      />
      {linkedPageContents && (
        <CategorySection fallbackText={"no tags"} mt="24px">
          {linkedPageContents?.map((page) => (
            <PageDetailsCard pageData={page} key={page.id} />
          ))}
        </CategorySection>
      )}
    </Layout>
  </>
)

const getPage = async (params) => {
  const notion = new NotionAPI()
  const blockMap = await notion.getPage(params.pageId.toString())
  return blockMap
}

const getAllPages = async () => {
  const { Client } = require("@notionhq/client")
  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const databaseId = process.env.NOTION_DATABASE_ID
  const response = await notion.databases.query({
    database_id: databaseId,
  })
  return response.results
}

const getRelatedPageLinks = (allPages, blockMap, params) => {
  const linkedPageContents = getLinkedPagesByName(blockMap, params, allPages)
  const linkedPagesByTags = getLinkedPagesByTags(blockMap, params, allPages)
  const links = [...new Set([...linkedPageContents, ...linkedPagesByTags])]
  const cards: Array<PageDetailsCardData> = links.map((page) => ({
    id: page.id,
    title: page.properties.title.title[0].plain_text,
    tags: page.properties.tags.multi_select.map((tag) => tag.name),
    icon: page.icon?.file?.url ? page.icon.file.url : null,
    backgroundImage: page.cover?.external?.url ? page.cover.external.url : null,
  }))
  return cards
}

const getLinkedPagesByName = (blockMap, params, allPages) => {
  const linkedPageIds = blockMap.block[
    params.pageId.toString()
  ]?.value?.properties?._mkI
    ?.filter((link) => link.length > 1)
    .map((linkObj) => linkObj[1][0][1])
  const linkedPageContents = allPages.filter(
    (page) => linkedPageIds?.includes(page.id) && page.id !== params.pageId
  )

  return linkedPageContents
}

const getLinkedPagesByTags = (blockMap, params, allPages) => {
  const linkedTags =
    blockMap.block[params.pageId.toString()]?.value?.properties?.[
      "~Ogv"
    ]?.[0]?.[0].split(",")

  const linkedPagesByTags = allPages.filter(
    (page) =>
      page.properties.relatedContentsByTags.multi_select
        .map((tagObject) => tagObject.name)
        .some((tag) => linkedTags?.includes(tag)) && page.id !== params.pageId
  )
  return linkedPagesByTags
}

const getIds = async () => {
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

export const getStaticProps = async ({ params }) => {
  const blockMap = await getPage(params)
  const allPages = await getAllPages()
  const linkedPageContents = await getRelatedPageLinks(allPages, blockMap, params)
  const pageLogo = allPages.find((page) => page.id === params.pageId)?.icon?.file
    ?.url
    ? allPages.find((page) => page.id === params.pageId).icon?.file?.url
    : null

  return {
    props: {
      blockMap,
      linkedPageContents,
      params,
      pageLogo,
    },
    revalidate: 10,
  }
}

export default PageDetails
