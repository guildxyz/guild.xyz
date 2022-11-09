import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import { GetStaticProps } from "next"
export const getStaticProps: GetStaticProps = async () => {
  const { Client } = require("@notionhq/client")
  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const databaseId = process.env.NOTION_DATABASE_ID
  const response = await notion.databases.query({
    database_id: databaseId,
  })
  return {
    props: {},
  }
}

function Ecosystem() {
  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Ecosystem" showBackButton={false}></Layout>
    </>
  )
}

export default Ecosystem
