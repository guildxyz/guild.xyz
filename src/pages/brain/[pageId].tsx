import { Center } from "@chakra-ui/react"
import PageBrainCard from "components/brain/PageBrainCard"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CategorySection from "components/explorer/CategorySection"
import { GetServerSideProps } from "next"
import Image from "next/image"
import { NotionRenderer } from "react-notion-x"
import "react-notion-x/src/styles.css"
import CustomImage from "./components/customImage"
import CustomLink from "./components/customLink"
import Header from "./components/header"
import getAllPages from "./fetchers/getAllPages"
import getPage from "./fetchers/getPage"
import getRelatedPageLinks from "./fetchers/getRelatedPageLinks"

const PageDetails = ({ blockMap, linkedPageContents, params, pageLogo }) => (
  <>
    <LinkPreviewHead path="" />
    <Layout
      title={blockMap.block[params.pageId.toString()]?.value.properties.title[0][0]}
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const blockMap = await getPage(params)
  const allPages = await getAllPages()
  const linkedPageContents = getRelatedPageLinks(allPages, blockMap, params)
  const pageLogo = allPages.find((page) => page.id === params.pageId)?.icon?.file
    ?.url
    ? allPages.find((page) => page.id === params.pageId).icon?.file?.url
    : null

  return {
    props: {
      blockMap,
      linkedPageContents,
      params,
      pageLogo,
    },
  }
}

export default PageDetails
