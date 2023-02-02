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

export default getLinkedPagesByTags
