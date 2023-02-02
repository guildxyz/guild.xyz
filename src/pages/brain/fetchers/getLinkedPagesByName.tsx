const getLinkedPagesByName = (blockMap, pageId, allPages) => {
  const linkedPageIds = blockMap.block[pageId.toString()]?.value?.properties?._mkI
    ?.filter((link) => link.length > 1)
    .map((linkObj) => linkObj[1][0][1])
  const linkedPageContents = allPages.filter(
    (page) => linkedPageIds?.includes(page.id) && page.id !== pageId
  )

  return linkedPageContents
}

export default getLinkedPagesByName
