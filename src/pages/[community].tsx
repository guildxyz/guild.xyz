import { GetStaticProps, GetStaticPaths } from "next"
import { SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { Link } from "components/common/Link"
import Layout from "components/Layout"
import { communities } from "temporaryData/communities"
import type { Community } from "temporaryData/communities"
import Platforms from "components/community/Platforms"
import Staked from "components/community/Staked"
import Levels from "components/community/Levels"
import { CommunityProvider } from "components/community/Context"

type Props = {
  communityData: Community
}

const CommunityPage = ({ communityData }: Props): JSX.Element => (
  <CommunityProvider data={communityData}>
    <Layout
      title={`${communityData.name} community`}
      // bg="linear-gradient(white 0px, var(--chakra-colors-primary-50) 700px)"
      bg={`linear-gradient(white 0px, ${communityData.theme.color}15 700px)`}
    >
      <Stack spacing={10}>
        <Text fontWeight="medium">{communityData.description}</Text>
        <SimpleGrid templateColumns="3fr 2fr" gap="10">
          <Platforms />
          <Staked />
        </SimpleGrid>
        <Levels />
        {/* <pre>{JSON.stringify(communityData, undefined, 2)}</pre> */}
        <Link href="/" pt={8}>
          Back to all communities
        </Link>
      </Stack>
    </Layout>
  </CommunityProvider>
)

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
