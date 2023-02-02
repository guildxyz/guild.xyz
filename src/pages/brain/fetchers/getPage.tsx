import { NotionAPI } from "notion-client"

const getPage = async (params) => {
  const notion = new NotionAPI()
  const blockMap = await notion.getPage(params.pageId.toString())
  return blockMap
}
export default getPage
