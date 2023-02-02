import { NotionAPI } from "notion-client"

const getPage = async (pageId) => {
  const notion = new NotionAPI()
  const blockMap = await notion.getPage(pageId)
  return blockMap
}
export default getPage
