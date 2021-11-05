import { HStack, Stack, Tag, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useColorContext } from "components/common/ColorContext"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import CategorySection from "components/index/CategorySection"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import JoinButton from "components/[guild]/JoinButton"
import Members from "components/[guild]/Members"
import { HallProvider, useHall } from "components/[hall]/Context"
import CustomizationButton from "components/[hall]/CustomizationButton"
import GuildAccessCard from "components/[hall]/GuildAccessCard"
import useHallMembers from "hooks/useHallMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import { useMemo } from "react"
import useSWR from "swr"
import halls from "temporaryData/halls"
import { Hall } from "temporaryData/types"
import fetchApi from "utils/fetchApi"

const HallPageContent = (): JSX.Element => {
  const { account } = useWeb3React()
  const { name, description, imageUrl, guilds } = useHall()
  const isOwner = useIsOwner(account)
  const members = useHallMembers(guilds)
  const { textColor, localThemeColor } = useColorContext()

  // Only show the join button if all guilds in the hall are on the same DC server
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
      textColor={textColor}
      description={description}
      showLayoutDescription
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
      background={localThemeColor}
    >
      <Stack position="relative" spacing="12">
        <CategorySection
          title={
            <Text textColor={textColor} textShadow="md">
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
  hallData: Hall
}

const HallPageWrapper = ({ hallData: hallDataInitial }: Props): JSX.Element => {
  const { data: hallData } = useSWR(`/group/urlName/${hallDataInitial.urlName}`, {
    fallbackData: hallDataInitial,
  })

  return (
    <HallProvider data={hallData}>
      <HallPageContent />
    </HallProvider>
  )
}

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = halls.find((i) => i.urlName === params.hall)

  const hallData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetchApi(`/group/urlName/${params.hall?.toString()}`)

  if (!hallData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { hallData },
    revalidate: 10,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const mapToPaths = (_: Hall[]) =>
    _.map(({ urlName: hall }) => ({ params: { hall } }))

  const pathsFromLocalData = mapToPaths(halls)

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetchApi(`/group`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default HallPageWrapper
