import { BrainCardData } from "types"

const getAllPages = async () => {
  const { Client } = require("@notionhq/client")
  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const databaseId = process.env.NOTION_DATABASE_ID
  const response = await notion.databases.query({
    database_id: databaseId,
  })
  return response.results
}

const getLinkedPagesByName = (blockMap, pageId, allPages) => {
  const linkedPageIds = blockMap.block[pageId.toString()]?.value?.properties?._mkI
    ?.filter((link) => link.length > 1)
    .map((linkObj) => linkObj[1][0][1])
  const linkedPageContents = allPages.filter(
    (page) => linkedPageIds?.includes(page.id) && page.id !== pageId
  )

  return linkedPageContents
}

const getLinkedPagesByTags = (blockMap, pageId, allPages) => {
  const linkedTags =
    blockMap.block[pageId]?.value?.properties?.["~Ogv"]?.[0]?.[0].split(",")

  const linkedPagesByTags = allPages.filter(
    (page) =>
      page.properties.relatedContentsByTags.multi_select
        .map((tagObject) => tagObject.name)
        .some((tag) => linkedTags?.includes(tag)) && page.id !== pageId
  )
  return linkedPagesByTags
}

const getRelatedPageLinks = (allPages, blockMap, pageId) => {
  const linkedPageContents = getLinkedPagesByName(blockMap, pageId, allPages)
  const linkedPagesByTags = getLinkedPagesByTags(blockMap, pageId, allPages)
  const links = [...new Set([...linkedPageContents, ...linkedPagesByTags])].filter(
    (pageLink) => pageLink.properties.visibility.checkbox === true
  )
  const cards: Array<BrainCardData> = links
    .map((page) => ({
      id: page.id,
      title: page.properties.title.title[0].plain_text,
      tags: page.properties.tags.multi_select.map((tag) => tag.name),
      icon: page.icon?.file?.url ?? null,
      backgroundImage: page.cover?.file?.url ?? null,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))

  return cards
}

export {
  getAllPages,
  getLinkedPagesByName,
  getLinkedPagesByTags,
  getRelatedPageLinks,
}
