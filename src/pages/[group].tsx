import { HStack, Stack, Tag, Text, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CustomizationButton from "components/common/CustomizationButton"
import DeleteButton from "components/common/DeleteButton"
import GroupLayout from "components/common/Layout/GroupLayout"
import Section from "components/common/Section"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import { GroupProvider, useGroup } from "components/[group]/Context"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import Members from "components/[guild]/Members"
import useGroupMembers from "hooks/useGroupMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import groups from "temporaryData/groups"
import { Group } from "temporaryData/types"

type Props = {
  groupData: Group
}

const GroupPageContent = (): JSX.Element => {
  const { account } = useWeb3React()
  const { name, imageUrl, guilds } = useGroup()
  const isOwner = useIsOwner(account)
  const members = useGroupMembers(guilds)

  const { colorMode } = useColorMode()

  return (
    <GroupLayout
      title={name}
      imageUrl={imageUrl}
      action={
        <HStack spacing={2}>
          {isOwner && (
            <>
              <CustomizationButton white />
              <DeleteButton white />
            </>
          )}
        </HStack>
      }
    >
      <Stack spacing="12">
        <CategorySection
          title={
            <Text
              color={colorMode === "light" ? "primary.800" : "white"}
              textShadow="md"
            >
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
