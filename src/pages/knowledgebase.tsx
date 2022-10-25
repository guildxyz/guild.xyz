import { Link, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"

export async function getStaticProps() {
  const tags = await getTags()
  return {
    props: {
      tags,
    },
  }
}

async function getTags() {
  const { Client } = require("@notionhq/client")

  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const databaseId = process.env.NOTION_DATABASE_ID

  const response = await notion.databases.retrieve({ database_id: databaseId })
  const tags = response.properties.tags.multi_select.options.map((a) => a.name)
  return tags
}

function Knowledgebase({ tags }) {
  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Knowledge base" description="dummytummy" showBackButton={false}>
        {tags.map((tag) => (
          <Link
            href={`/pages?tagkind=${tag}`}
            _hover={{ textDecor: "none" }}
            borderRadius="2xl"
            w="full"
            h="full"
            key={tag}
          >
            <Tag as="li">
              <TagLeftIcon />
              <TagLabel>{tag}</TagLabel>
            </Tag>
          </Link>
        ))}
      </Layout>
    </>
  )
}

export default Knowledgebase
