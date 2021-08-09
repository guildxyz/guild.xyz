import { Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import { CommunityProvider } from "components/[community]/Context"
import Levels from "components/[community]/Levels"
import Platforms from "components/[community]/Platforms"
import Staked from "components/[community]/Staked"
import { Info } from "phosphor-react"
import type { Community } from "temporaryData/communities"

type Props = {
  communityData: Community
}

const CommunityPage = ({ communityData }: Props): JSX.Element => (
  <CommunityProvider data={communityData}>
    <Layout title={communityData.name} imageUrl={communityData.imageUrl}>
      <Stack spacing={{ base: 7, xl: 9 }}>
        <Pagination />
        {communityData.levels.length ? (
          <>
            <SimpleGrid
              templateColumns={{ base: "100%", md: "3fr 2fr" }}
              gap={{ base: 5, md: 7, xl: 9 }}
            >
              <Platforms />
              <Staked />
            </SimpleGrid>
            <SimpleGrid gap="4">
              {communityData.parallelLevels ? (
                communityData.levels.map((level) => (
                  <Levels key={level.id} levels={[level]} />
                ))
              ) : (
                <Levels levels={communityData.levels} />
              )}
            </SimpleGrid>
          </>
        ) : (
          <Card p="6" isFullWidthOnMobile>
            <Text
              fontWeight="medium"
              colorScheme="gray"
              display="flex"
              alignItems="center"
            >
              <Icon as={Info} mr="2" />
              This community is not using Agora Space yet. Let them know they should!
            </Text>
          </Card>
        )}
      </Stack>
    </Layout>
  </CommunityProvider>
)

export {
  getStaticPaths,
  getStaticProps,
} from "components/[community]/utils/dataFetching"

export default CommunityPage
