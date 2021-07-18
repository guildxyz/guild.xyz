import { GetStaticProps, GetStaticPaths } from "next"
import { SimpleGrid, Stack, Text, Box } from "@chakra-ui/react"
import { Link } from "components/common/Link"
import { CommunityProvider } from "components/community/Context"
import Levels from "components/community/Levels"
import Platforms from "components/community/Platforms"
import Staked from "components/community/Staked"
import Layout from "components/Layout"
import type { Community } from "temporaryData/communities"
import { communities } from "temporaryData/communities"

type Props = {
  communityData: Community
}

const CommunityPage = ({ communityData }: Props): JSX.Element => (
  <CommunityProvider data={communityData}>
    <Layout title={`${communityData.name} community`}>
      <Stack spacing={{ base: 7, xl: 9 }}>
        <Text fontWeight="medium">{communityData.description}</Text>
        <SimpleGrid
          templateColumns={{ base: "100%", md: "3fr 2fr" }}
          gap={{ base: 5, md: 7, xl: 9 }}
        >
          <Platforms />
          <Staked />
        </SimpleGrid>
        <Box>
          <Levels />
        </Box>
        {/* <pre>{JSON.stringify(communityData, undefined, 2)}</pre> */}
        <Link href="/" pt={2}>
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
