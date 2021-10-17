import { HStack, SimpleGrid, Stack, Tag, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CustomizationButton from "components/common/CustomizationButton"
import useEdit from "components/common/CustomizationButton/hooks/useEdit"
import DeleteButton from "components/common/DeleteButton"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import { GuildProvider, useGuild } from "components/[guild]/Context"
import EditForm from "components/[guild]/EditForm"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import JoinButton from "components/[guild]/JoinButton"
import LogicDivider from "components/[guild]/LogicDivider"
import Members from "components/[guild]/Members"
import useMembers from "components/[guild]/Members/hooks/useMembers"
import RequirementCard from "components/[guild]/RequirementCard"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { GetStaticPaths, GetStaticProps } from "next"
import React, { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useSWR, { mutate } from "swr"
import guilds from "temporaryData/guilds"
import { Guild } from "temporaryData/types"
import kebabToCamelCase from "utils/kebabToCamelCase"

const fetchGuild = (urlName: string): Promise<Guild> =>
  fetch(`${process.env.NEXT_PUBLIC_API}/guild/urlName/${urlName}`).then((response) =>
    response.ok ? response.json() : undefined
  )

// If the value starts with a "[", we should try to parse it and use it as an array... (interval attribute)
const tryToParse = (value: any) => {
  if (typeof value !== "string" || !value?.startsWith("[")) return value

  try {
    const parsed = JSON.parse(value)
    return parsed
  } catch (_) {
    return value
  }
}

const GuildPageContent = (): JSX.Element => {
  const { account } = useWeb3React()
  const { id, urlName, name, guildPlatforms, imageUrl, requirements, logic } =
    useGuild()
  const formReset = useMemo(
    () => ({
      name,
      imageUrl,
      logic,
      requirements: requirements.map((requirement) => ({
        ...requirement,
        value: tryToParse(requirement.value),
      })),
    }),
    [name, imageUrl, logic, requirements]
  )

  // Reset form values every time the data changes on the API
  useEffect(() => {
    methods.reset({ ...formReset })
  }, [formReset])

  const hashtag = `${kebabToCamelCase(urlName)}Guild`
  const isOwner = useIsOwner(account)
  const members = useMembers()

  const methods = useForm({
    mode: "all",
    defaultValues: { ...formReset },
  })

  const [editMode, setEditMode] = useState(false)
  const { onSubmit, isLoading } = useEdit("guild", id, () => {
    mutate(["guild", id])
    setEditMode(false)
  })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  return (
    <Layout
      title={editMode ? "Edit guild" : name}
      action={
        <HStack spacing={2}>
          {!editMode && guildPlatforms[0] && <JoinButton />}
          {isOwner && (
            <>
              {!editMode && <CustomizationButton />}
              <EditButtonGroup
                editMode={editMode}
                setEditMode={setEditMode}
                onClick={methods.handleSubmit(onSubmit)}
                isLoading={isLoading}
              />
              {!editMode && <DeleteButton />}
            </>
          )}
        </HStack>
      }
      imageUrl={editMode ? null : imageUrl}
    >
      {!editMode ? (
        <Stack spacing="12">
          <Section title="Requirements">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 6 }}>
              <VStack>
                {requirements?.map((requirement, i) => (
                  <React.Fragment key={i}>
                    <RequirementCard requirement={requirement} />
                    {i < requirements.length - 1 && <LogicDivider logic={logic} />}
                  </React.Fragment>
                ))}
              </VStack>
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
            <Members
              members={members}
              fallbackText="This guild has no members yet"
            />
          </Section>
        </Stack>
      ) : (
        <FormProvider {...methods}>
          <EditForm />
        </FormProvider>
      )}
    </Layout>
  )
}

type Props = {
  guildData: Guild
}

const GuildPageWrapper = ({ guildData: guildDataInitial }: Props): JSX.Element => {
  const { data: guildData } = useSWR(
    ["guild", guildDataInitial.id],
    () => fetchGuild(guildDataInitial.urlName),
    {
      fallbackData: guildDataInitial,
    }
  )

  return (
    <GuildProvider data={guildData}>
      <GuildPageContent />
    </GuildProvider>
  )
}

const DEBUG = false

const getStaticProps: GetStaticProps = async ({ params }) => {
  const localData = guilds.find((i) => i.urlName === params.guild)

  const guildData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetchGuild(params.guild?.toString())

  if (!guildData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { guildData },
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
      : await fetch(`${process.env.NEXT_PUBLIC_API}/guild`).then((response) =>
          response.ok ? response.json().then(mapToPaths) : pathsFromLocalData
        )

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }
export default GuildPageWrapper
