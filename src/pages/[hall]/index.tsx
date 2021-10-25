import { Box, HStack, Stack, Tag, Text, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CustomizationButton from "components/common/CustomizationButton"
import DeleteButton from "components/common/DeleteButton"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import JoinButton from "components/[guild]/JoinButton"
import Members from "components/[guild]/Members"
import { HallProvider, useHall } from "components/[hall]/Context"
import { fetchHall } from "components/[hall]/utils/fetchHall"
import useHallMembers from "hooks/useHallMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import { useMemo } from "react"
import useSWR from "swr"
import halls from "temporaryData/halls"
import { Hall } from "temporaryData/types"

const HallPageContent = (): JSX.Element => {
  const { account } = useWeb3React()
  const { name, imageUrl, guilds } = useHall()
  const isOwner = useIsOwner(account)
  const members = useHallMembers(guilds)
  const { colorMode } = useColorMode()

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
      titleColor={colorMode === "light" ? "primary.800" : "white"}
      imageUrl={imageUrl}
      imageBg={colorMode === "light" ? "primary.800" : "transparent"}
      action={
        <HStack spacing={2}>
          {shouldShowJoin && <JoinButton />}
          {isOwner && (
            <>
              <CustomizationButton white />
              <EditButtonGroup simple />
              <DeleteButton white />
            </>
          )}
        </HStack>
      }
      background={
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h={80}
          bgColor={"primary.500"}
          opacity={colorMode === "light" ? 1 : 0.5}
        />
      }
    >
      <Stack position="relative" spacing="12">
        <CategorySection
          title={
            <Text
              color={colorMode === "light" ? "primary.800" : "white"}
              textShadow="md"
            >
              Guilds in this hall
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
  const { data: hallData } = useSWR(["hall", hallDataInitial.urlName], fetchHall, {
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
      : await fetchHall(null, params.hall?.toString())

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
      : await fetch(`${process.env.NEXT_PUBLIC_API}/group`).then((response) =>
          response.ok ? response.json().then(mapToPaths) : undefined
        )

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }

export default HallPageWrapper
