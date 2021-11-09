import { HStack, Stack, Tag, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import CategorySection from "components/index/CategorySection"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import JoinButton from "components/[guild]/JoinButton"
import Members from "components/[guild]/Members"
import CustomizationButton from "components/[hall]/CustomizationButton"
import GuildAccessCard from "components/[hall]/GuildAccessCard"
import useHall from "components/[hall]/hooks/useHall"
import { ThemeProvider, useThemeContext } from "components/[hall]/ThemeContext"
import { motion } from "framer-motion"
import useHallMembers from "hooks/useHallMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import { useMemo } from "react"
import { SWRConfig } from "swr"
import halls from "temporaryData/halls"
import { Hall } from "temporaryData/types"
import fetchApi from "utils/fetchApi"

const guildAccessCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
}

const HallPage = (): JSX.Element => {
  const { name, description, imageUrl, guilds } = useHall()

  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const members = useHallMembers(guilds)
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

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
      backgroundImage={localBackgroundImage}
    >
      <Stack position="relative" spacing="12">
        <CategorySection
          animated
          title={
            <Text textColor={textColor} textShadow="md">
              Guilds in this hall
            </Text>
          }
          fallbackText=""
        >
          {guilds.map((guildData) => (
            <motion.div key={guildData.guild.id} variants={guildAccessCardVariants}>
              <GuildAccessCard guildData={guildData.guild} />
            </motion.div>
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
  fallback: Hall
}

const HallPageWrapper = ({ fallback }: Props): JSX.Element => (
  <SWRConfig value={{ fallback }}>
    <ThemeProvider>
      <HallPage />
    </ThemeProvider>
  </SWRConfig>
)

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = halls.find((i) => i.urlName === params.hall)
  const endpoint = `/group/urlName/${params.hall?.toString()}`

  const data =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetchApi(endpoint)

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      fallback: {
        [endpoint]: data,
      },
    },
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
