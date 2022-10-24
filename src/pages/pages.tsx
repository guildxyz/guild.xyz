import { Link, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import { useRouter } from "next/router"

export async function getStaticProps() {
  const { Client } = require("@notionhq/client")

  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const databaseId = process.env.NOTION_DATABASE_ID
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        {
          property: "tags",
          multi_select: {
            contains: "api",
          },
        },
      ],
    },
  })
  const pages = response.results

  return {
    props: {
      // ?? should i use props w only 1 params?
      pages,
    },
  }
}

function Page({ pages }) {
  const router = useRouter() // ?? get query params before notion request
  // console.log(router.query)

  return (
    // ?? why i need the next line?
    <>
      <LinkPreviewHead path="" />
      <Layout title="DB list" description="dummytummy" showBackButton={false}>
        {pages.map((page) => (
          <Link
            href={`/help/${page.id}`}
            _hover={{ textDecor: "none" }}
            borderRadius="2xl"
            w="full"
            h="full"
            key={page}
          >
            <Tag as="li">
              <TagLeftIcon />
              <TagLabel>{page.properties.title.title[0].plain_text}</TagLabel>
            </Tag>
          </Link>
        ))}
      </Layout>
    </>
  )
}

export default Page
