import { HStack, Stack, Tag, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import CategorySection from "components/index/CategorySection"
import { GuildProvider, useGuild } from "components/[guild]/Context"
import Members from "components/[guild]/Members"
import { GetStaticPaths, GetStaticProps } from "next"
import groups from "temporaryData/groups"
import { Group } from "temporaryData/types"

type Props = {
  groupData: Group
}

const GroupPageContent = (): JSX.Element => {
  const { name, imageUrl, members } = useGuild()

  return (
    <Layout title={name} imageUrl={imageUrl}>
      <Stack spacing="12">
        <CategorySection title="Guilds in this group" fallbackText="">
          TODO
        </CategorySection>

        <Section
          title={
            <HStack spacing={2} alignItems="center">
              <Text as="span">Members</Text>
              <Tag size="sm">
                {members?.filter((address) => !!address)?.length ?? 0}
              </Tag>
            </HStack>
          }
        >
          <Members members={members} fallbackText="This group has no members yet" />
        </Section>
      </Stack>
    </Layout>
  )
}

const GroupPageWrapper = ({ groupData }: Props): JSX.Element => (
  <GuildProvider data={groupData}>
    <GroupPageContent />
  </GuildProvider>
)

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = groups.find((i) => i.urlName === params.group)

  // TODO: fetch data from the API
  const groupData = localData

  if (!groupData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { groupData },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Group[]) =>
    _.map(({ urlName: group }) => ({ params: { group } }))

  const pathsFromLocalData = mapToPaths(groups)

  // TODO: fetch data from the API
  const paths = pathsFromLocalData

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default GroupPageWrapper
