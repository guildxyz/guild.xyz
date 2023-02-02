import { BrainCardData } from "types"
import getLinkedPagesByName from "./getLinkedPagesByName"
import getLinkedPagesByTags from "./getLinkedPagesByTags"

const getRelatedPageLinks = (allPages, blockMap, params) => {
  const linkedPageContents = getLinkedPagesByName(blockMap, params, allPages)
  const linkedPagesByTags = getLinkedPagesByTags(blockMap, params, allPages)
  const Links = [...new Set([...linkedPageContents, ...linkedPagesByTags])].filter(
    (pageLink) => pageLink.properties.visibility.checkbox === true
  )
  const cards: Array<BrainCardData> = Links.map((page) => ({
    id: page.id,
    title: page.properties.title.title[0].plain_text,
    tags: page.properties.tags.multi_select.map((tag) => tag.name),
    icon: page.icon?.file?.url ?? null,
    backgroundImage: page.cover?.file?.url ?? null,
  }))
  return cards
}
export default getRelatedPageLinks
