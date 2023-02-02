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

export default getLinkedPagesByName
