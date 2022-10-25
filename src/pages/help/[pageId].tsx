import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import { GetStaticPaths } from "next"
import { useRouter } from "next/router"

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [{ params: { pageId: "5ea7b16a-e092-4a3a-a361-34ed6b8af859" } }], // ?? index.tsx 289: how it works?
    fallback: "blocking",
  }
}

export async function getStaticProps({ params }) {
  const data = await fetch(
    `https://notion-api.splitbee.io/v1/page/${params.pageId.toString()}`
  ).then((res) => res.json())
  return {
    props: {
      blockMap: data,
    },
  }
}

function Page({ blockMap }) {
  const router = useRouter()
  // console.log(router.query)
  console.log(blockMap)

  return (
    <>
      <LinkPreviewHead path="" />
      <Layout title="Page details" description="dummytummy" showBackButton={false}>
        {/* <NotionRenderer blockMap={blockMap} /> */}
      </Layout>
    </>
  )
}

export default Page
