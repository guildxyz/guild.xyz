import { Icon, Stack, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import ActionCard from "components/[community]/common/ActionCard"
import Pagination from "components/[community]/common/Pagination"
import { CommunityProvider } from "components/[community]/Context"
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
        <Stack spacing={{ base: 7 }}>
          <ActionCard
            title="About"
            description={communityData.description || "No description"}
          />
          <Card p="6" isFullWidthOnMobile>
            <Text
              fontWeight="medium"
              colorScheme="gray"
              display="flex"
              alignItems="center"
            >
              <Icon as={Info} mr="2" />
              More info coming soon
            </Text>
          </Card>
        </Stack>
      </Stack>
    </Layout>
  </CommunityProvider>
)

export {
  getStaticPaths,
  getStaticProps,
} from "components/[community]/utils/dataFetching"

export default CommunityPage
