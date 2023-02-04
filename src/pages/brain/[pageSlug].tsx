import { Center } from "@chakra-ui/react"
import CustomImage from "components/brain/CustomImage"
import CustomLink from "components/brain/CustomLink"
import Header from "components/brain/Header"
import PageBrainCard from "components/brain/PageBrainCard"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import { GetServerSideProps } from "next"
import Image from "next/image"
import { NotionAPI } from "notion-client"
import { NotionRenderer } from "react-notion-x"
import "react-notion-x/src/styles.css"
import slugify from "slugify"
import { getAllPages, getRelatedPageLinks } from "utils/brain/fetcher"

const PageDetails = ({ blockMap, linkedPageContents, pageId, pageLogo }) => (
  <>
    <LinkPreviewHead path="" />
    <Layout
      backButton={{ href: "/guildverse", text: "Go back to Guildverse" }}
      title={blockMap.block[pageId]?.value.properties.title[0][0]}
      image={
        pageLogo && (
          <Center boxSize={16} position="relative">
            <Image
              src={pageLogo}
              layout="fill"
              objectFit="contain"
              quality="30"
              style={{
                overflow: "visible",
              }}
              alt="logo"
            ></Image>
          </Center>
        )
      }
    >
      <NotionRenderer
        recordMap={blockMap}
        forceCustomImages={true}
        components={{
          nextImage: CustomImage,
          Collection: Header,
          PageLink: CustomLink,
        }}
      />
      {linkedPageContents && (
        <CategorySection fallbackText={"there are no linked pages"} mt="24px">
          {linkedPageContents?.map((page) => (
            <PageBrainCard pageData={page} key={page.id} />
          ))}
        </CategorySection>
      )}
    </Layout>
  </>
)

// Importing it here because it can't be used in a file which might be imported in a client-side code
const getPage = async (pageId) => {
  const notion = new NotionAPI()
  const blockMap = await notion.getPage(pageId)
  return blockMap
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59")

  const allPages = await getAllPages()
  const pageId = allPages
    .map((page) => ({
      id: page.id,
      slugifiedTitle: slugify(page.properties.title.title[0].plain_text, {
        lower: true,
      }),
    }))
    .find((plate) => plate.slugifiedTitle === params.pageSlug).id
  const blockMap = await getPage(pageId)

  const linkedPageContents = getRelatedPageLinks(allPages, blockMap, pageId)
  const pageLogo = allPages.find((page) => page.id === pageId)?.icon?.file?.url
    ? allPages.find((page) => page.id === pageId).icon?.file?.url
    : null

  return {
    props: {
      blockMap,
      linkedPageContents,
      pageId,
      pageLogo,
    },
  }
}

export default PageDetails
