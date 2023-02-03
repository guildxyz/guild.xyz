import { BrainCardData } from "types"
import getLinkedPagesByName from "./getLinkedPagesByName"
import getLinkedPagesByTags from "./getLinkedPagesByTags"

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
export default getRelatedPageLinks
