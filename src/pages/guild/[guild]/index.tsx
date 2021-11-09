import {
  EASINGS,
  HStack,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import JoinButton from "components/[guild]/JoinButton"
import LogicDivider from "components/[guild]/LogicDivider"
import Members from "components/[guild]/Members"
import useMembers from "components/[guild]/Members/hooks/useMembers"
import RequirementCard from "components/[guild]/RequirementCard"
import { motion } from "framer-motion"
import { GetStaticPaths, GetStaticProps } from "next"
import React from "react"
import { SWRConfig } from "swr"
import guilds from "temporaryData/guilds"
import { Guild } from "temporaryData/types"
import fetchApi from "utils/fetchApi"
import kebabToCamelCase from "utils/kebabToCamelCase"

const MotionVStack = motion(VStack)

const requirementContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const requirementCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
}

const GuildPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const {
    urlName,
    name,
    description,
    guildPlatforms,
    imageUrl,
    requirements,
    logic,
  } = useGuild()

  const hashtag = `${kebabToCamelCase(urlName)}Guild`
  const isOwner = useIsOwner(account)
  const members = useMembers()

  const imageBg = useColorModeValue("gray.700", "transparent")

  return (
    <Layout
      title={name}
      description={description}
      showLayoutDescription
      action={
        <HStack spacing={2}>
          {isOwner && <EditButtonGroup editMode={false} />}
          {guildPlatforms[0] && <JoinButton />}
        </HStack>
      }
      imageUrl={imageUrl}
      imageBg={imageBg}
    >
      <Stack spacing="12">
        <Section title="Requirements">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
            <MotionVStack
              variants={requirementContainerVariants}
              initial="hidden"
              animate="show"
            >
              {requirements?.map((requirement, i) => (
                <MotionVStack
                  key={requirement.address}
                  width="full"
                  spacing={2}
                  variants={requirementCardVariants}
                  transition={{ ease: EASINGS.easeOut }}
                >
                  <RequirementCard requirement={requirement} />
                  {i < requirements.length - 1 && <LogicDivider logic={logic} />}
                </MotionVStack>
              ))}
            </MotionVStack>
          </SimpleGrid>
        </Section>
        {/* <Section title={`Use the #${hashtag} hashtag!`}>
              <TwitterFeed hashtag={`${hashtag}`} />
            </Section> */}
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
          <Members members={members} fallbackText="This guild has no members yet" />
        </Section>
      </Stack>
    </Layout>
  )
}

type Props = {
  fallback: Guild
}

const GuildPageWrapper = ({ fallback }: Props): JSX.Element => (
  <SWRConfig value={{ fallback }}>
    <GuildPage />
  </SWRConfig>
)

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = guilds.find((i) => i.urlName === params.guild)
  const endpoint = `/guild/urlName/${params.guild?.toString()}`

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
  const mapToPaths = (_: Guild[]) =>
    _.map(({ urlName: guild }) => ({ params: { guild } }))

  const pathsFromLocalData = mapToPaths(guilds)

  const paths =
    DEBUG && process.env.NODE_ENV !== "production"
      ? pathsFromLocalData
      : await fetchApi(`/guild`).then(mapToPaths)

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }
export default GuildPageWrapper
