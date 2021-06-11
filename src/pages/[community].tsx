import { GetStaticProps, GetStaticPaths } from "next"
import { Stack } from "@chakra-ui/react"
import { Link } from "components/common/Link"
import Layout from "components/Layout"
import { communities } from "temporaryData/communities"
import type { Community } from "temporaryData/communities"
import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"

type Props = {
  communityData: Community
}

const CommunityPage = ({ communityData }: Props): JSX.Element => {
  const { chainId } = useWeb3React()

  return (
    <Layout
      title={`${communityData.name} community`}
      token={communityData.chainData[Chains[chainId]]?.token}
    >
      <Stack>
        <pre>{JSON.stringify(communityData, undefined, 2)}</pre>
        <Link href="/" pt={8}>
          Back to all communities
        </Link>
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const communityData = communities.find((i) => i.urlName === params.community)

  if (!communityData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { communityData },
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = communities.map((i) => ({
    params: {
      community: i.urlName,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export default CommunityPage
