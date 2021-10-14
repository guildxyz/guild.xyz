import { HStack, Stack, Tag, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import { GuildProvider, useGuild } from "components/[guild]/Context"
import Members from "components/[guild]/Members"
import { GetStaticPaths, GetStaticProps } from "next"
import groups from "temporaryData/groups"
import { Group } from "temporaryData/types"

type Props = {
  groupData: Group
}

const GroupPageContent = (): JSX.Element => {
  const { name, imageUrl, guilds, members } = useGuild()

  return (
    <Layout title={name} imageUrl={imageUrl}>
      <Stack spacing="12">
        <CategorySection title="Guilds in this group" fallbackText="">
          {guilds.map((guildData) => (
            <GuildCard key={guildData.guild.id} guildData={guildData.guild} />
          ))}
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

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = groups.find((i) => i.urlName === params.group)

  const groupData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetch(
          `${process.env.NEXT_PUBLIC_API}/group/urlName/${params.group}`
        ).then((response: Response) => (response.ok ? response.json() : undefined))

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

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetch(`${process.env.NEXT_PUBLIC_API}/group`).then((response) =>
          response.ok ? response.json().then(mapToPaths) : pathsFromLocalData
        )

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default GroupPageWrapper
