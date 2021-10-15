import { HStack, Stack, Tag, Text } from "@chakra-ui/react"
import DeleteButton from "components/common/DeleteButton"
import EditButton from "components/common/EditButton"
import GroupLayout from "components/common/Layout/GroupLayout"
import Section from "components/common/Section"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import { GroupProvider, useGroup } from "components/[group]/Context"
import Members from "components/[guild]/Members"
import { GetStaticPaths, GetStaticProps } from "next"
import { useMemo } from "react"
import groups from "temporaryData/groups"
import { Group } from "temporaryData/types"

type Props = {
  groupData: Group
}

const unique = (value, index, self): boolean => {
  return self.indexOf(value) === index
}

const GroupPageContent = (): JSX.Element => {
  const { name, imageUrl, guilds } = useGroup()
  const members = useMemo(
    () =>
      guilds
        ?.map((guildData) => guildData.guild.members)
        .reduce((arr1, arr2) => arr1.concat(arr2))
        .filter(unique) || [],
    [guilds]
  )

  return (
    <GroupLayout
      title={name}
      imageUrl={imageUrl}
      action={
        <HStack spacing={2}>
          <EditButton white />
          <DeleteButton white />
        </HStack>
      }
    >
      <Stack spacing="12">
        <CategorySection
          title={
            <Text color="primary.800" textShadow="md">
              Guilds in this group
            </Text>
          }
          fallbackText=""
        >
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
    </GroupLayout>
  )
}

const GroupPageWrapper = ({ groupData }: Props): JSX.Element => (
  <GroupProvider data={groupData}>
    <GroupPageContent />
  </GroupProvider>
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
