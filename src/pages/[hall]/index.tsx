import {
  Box,
  HStack,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useColorContext } from "components/common/ColorContext"
import CustomizationButton from "components/common/CustomizationButton"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import CategorySection from "components/index/CategorySection"
import { GroupProvider, useGroup } from "components/[group]/Context"
import GuildAccessCard from "components/[group]/GuildAccessCard"
import { fetchGroup } from "components/[group]/utils/fetchGroup"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import JoinButton from "components/[guild]/JoinButton"
import Members from "components/[guild]/Members"
import useGroupMembers from "hooks/useGroupMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import { useMemo } from "react"
import useSWR from "swr"
import groups from "temporaryData/groups"
import { Group } from "temporaryData/types"

const GroupPageContent = (): JSX.Element => {
  const { account } = useWeb3React()
  const { name, imageUrl, guilds } = useGroup()
  const isOwner = useIsOwner(account)
  const members = useGroupMembers(guilds)
  const { colorMode } = useColorMode()
  const { textColor, localThemeColor } = useColorContext()
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Only show the join button if all guilds in the group are on the same DC server
  const shouldShowJoin = useMemo(() => {
    const platformId = guilds?.[0].guild.guildPlatforms[0].platformId

    guilds.forEach((guildData) => {
      if (guildData.guild.guildPlatforms[0].platformId !== platformId) return false
    })

    return true
  }, [guilds])

  return (
    <Layout
      title={name}
      titleColor={textColor}
      imageUrl={imageUrl}
      imageBg={textColor === "primary.800" ? "primary.800" : "transparent"}
      action={
        <HStack spacing={2}>
          {isOwner && (
            <>
              <CustomizationButton />
              <EditButtonGroup />
            </>
          )}
          {shouldShowJoin && <JoinButton />}
        </HStack>
      }
      background={
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h={isMobile && !isOwner ? "285px" : 80}
          bgColor={localThemeColor}
          opacity={colorMode === "light" ? 1 : 0.5}
        />
      }
    >
      <Stack position="relative" spacing="12">
        <CategorySection
          title={
            <Text color={textColor} textShadow="md">
              Guilds in this hall
            </Text>
          }
          fallbackText=""
        >
          {guilds.map((guildData) => (
            <GuildAccessCard key={guildData.guild.id} guildData={guildData.guild} />
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
          <Members members={members} fallbackText="This hall has no members yet" />
        </Section>
      </Stack>
    </Layout>
  )
}

type Props = {
  groupData: Group
}

const GroupPageWrapper = ({ groupData: groupDataInitial }: Props): JSX.Element => {
  const { data: groupData } = useSWR(
    ["group", groupDataInitial.urlName],
    fetchGroup,
    {
      fallbackData: groupDataInitial,
    }
  )

  return (
    <GroupProvider data={groupData}>
      <GroupPageContent />
    </GroupProvider>
  )
}

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = groups.find((i) => i.urlName === params.hall)

  const groupData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetchGroup(null, params.hall?.toString())

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
    _.map(({ urlName: hall }) => ({ params: { hall } }))

  const pathsFromLocalData = mapToPaths(groups)

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetch(`${process.env.NEXT_PUBLIC_API}/group`).then((response) =>
          response.ok ? response.json().then(mapToPaths) : undefined
        )

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default GroupPageWrapper
