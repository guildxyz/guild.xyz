import { DarkMode, Image } from "@chakra-ui/react"
import CustomLink from "components/brain/CustomLink"
import Header from "components/brain/Header"
import PageBrainCard from "components/brain/PageBrainCard"
import {
  getAllPages,
  getRelatedPageLinks,
} from "components/brain/utils/brainFetchers"
import Layout from "components/common/Layout"
import BackButton from "components/common/Layout/components/BackButton"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import GuildCardsGrid from "components/explorer/GuildCardsGrid"
import { GetServerSideProps } from "next"
import { NotionAPI } from "notion-client"
import { NotionRenderer } from "react-notion-x"
import "react-notion-x/src/styles.css"
import slugify from "slugify"

const PageDetails = ({ blockMap, linkedPageContents, pageId, pageLogo }) => (
  <>
    <LinkPreviewHead path="" />
    <DarkMode>
      <Layout
        backButton={<BackButton href="guildverse">Go back to Guildverse</BackButton>}
        title={blockMap.block[pageId]?.value.properties.title[0][0]}
        image={
          pageLogo && <Image src={pageLogo} boxSize="16" alt="logo" fontSize={0} />
        }
      >
        <NotionRenderer
          recordMap={blockMap}
          darkMode={true}
          components={{
            Collection: Header,
            PageLink: CustomLink,
          }}
        />
        {linkedPageContents && (
          <GuildCardsGrid mt="6">
            {linkedPageContents?.map((page) => (
              <PageBrainCard pageData={page} key={page.id} />
            ))}
          </GuildCardsGrid>
        )}
      </Layout>
    </DarkMode>
  </>
)

// Importing it here because it can't be used in a file which might be imported in a client-side code
const getPage = async (pageId) => {
  const notion = new NotionAPI()
  const blockMap = await notion.getPage(pageId)
  return blockMap
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=600")

  const allPages = await getAllPages()
  const pageId = allPages
    .map((page) => ({
      id: page.id,
      slugifiedTitle: slugify(page.properties.title.title[0]?.plain_text ?? "", {
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
