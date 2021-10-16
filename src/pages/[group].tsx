import {
  Button,
  HStack,
  Icon,
  IconButton,
  Stack,
  Tag,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CustomizationButton from "components/common/CustomizationButton"
import useEdit from "components/common/CustomizationButton/hooks/useEdit"
import DeleteButton from "components/common/DeleteButton"
import GroupLayout from "components/common/Layout/GroupLayout"
import Section from "components/common/Section"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import { GroupProvider, useGroup } from "components/[group]/Context"
import EditForm from "components/[group]/EditForm"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import Members from "components/[guild]/Members"
import useGroupMembers from "hooks/useGroupMembers"
import { GetStaticPaths, GetStaticProps } from "next"
import { Check, Gear } from "phosphor-react"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useSWR, { mutate } from "swr"
import groups from "temporaryData/groups"
import { Group } from "temporaryData/types"

const fetchGroup = (urlName: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/group/urlName/${urlName}`).then(
    (response: Response) => (response.ok ? response.json() : undefined)
  )

const GroupPageContent = (): JSX.Element => {
  const { account } = useWeb3React()
  const { id, name, imageUrl, guilds } = useGroup()
  const isOwner = useIsOwner(account)
  const members = useGroupMembers(guilds)
  const { colorMode } = useColorMode()

  const formReset = {
    guilds: guilds.map((guildData) => guildData.guild.id),
  }

  const methods = useForm({
    mode: "all",
    defaultValues: { ...formReset },
  })

  const [editMode, setEditMode] = useState(false)
  const { onSubmit, isLoading } = useEdit("group", id, () => {
    mutate(["group", id])
    setEditMode(false)
  })

  useEffect(() => {
    if (!editMode) methods.reset({ ...formReset })
  }, [editMode])

  return (
    <GroupLayout
      title={editMode ? "Edit group" : name}
      imageUrl={editMode ? null : imageUrl}
      editMode={editMode}
      action={
        <HStack spacing={2}>
          {isOwner && (
            <>
              {!editMode && <CustomizationButton white />}
              {!editMode && (
                <IconButton
                  minW={12}
                  rounded="2xl"
                  onClick={() => setEditMode(true)}
                  icon={<Icon as={Gear} />}
                  aria-label="Edit"
                />
              )}
              {editMode && (
                <>
                  <Button rounded="2xl" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button
                    rounded="2xl"
                    isLoading={isLoading}
                    onClick={methods.handleSubmit(onSubmit)}
                    leftIcon={<Icon as={Check} />}
                  >
                    Save
                  </Button>
                </>
              )}
              {!editMode && <DeleteButton white />}
            </>
          )}
        </HStack>
      }
    >
      {!editMode ? (
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
            <Members
              members={members}
              fallbackText="This group has no members yet"
            />
          </Section>
        </Stack>
      ) : (
        <FormProvider {...methods}>
          <EditForm />
        </FormProvider>
      )}
    </GroupLayout>
  )
}

type Props = {
  groupData: Group
}

const GroupPageWrapper = ({ groupData: groupDataInitial }: Props): JSX.Element => {
  const { data: groupData } = useSWR(
    ["group", groupDataInitial.id],
    () => fetchGroup(groupDataInitial.urlName),
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
  const localData = groups.find((i) => i.urlName === params.group)

  const groupData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetchGroup(params.group?.toString())

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
