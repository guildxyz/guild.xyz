import { HStack } from "@chakra-ui/layout"
import { useWeb3React } from "@web3-react/core"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import { GuildProvider, useGuild } from "components/[guild]/Context"
import EditForm from "components/[guild]/EditForm"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import { fetchGuild } from "components/[guild]/utils/fetchGuild"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { GetServerSideProps } from "next"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import guilds from "temporaryData/guilds"
import { Guild } from "temporaryData/types"

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

const GuildEditPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const { name, imageUrl, requirements, logic } = useGuild()
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

  const methods = useForm({
    mode: "all",
    defaultValues: { ...formReset },
  })

  // Reset form values every time the data changes on the API
  useEffect(() => {
    methods.reset({ ...formReset })
  }, [formReset])

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  return (
    <FormProvider {...methods}>
      <Layout
        title="Edit Guild"
        action={
          <HStack spacing={2}>{isOwner && <EditButtonGroup editMode />}</HStack>
        }
      >
        <EditForm />
      </Layout>
    </FormProvider>
  )
}

type Props = {
  guildData: Guild
}

const GuildEditPageWrapper = ({ guildData }: Props): JSX.Element => (
  <GuildProvider data={guildData}>
    <GuildEditPage />
  </GuildProvider>
)

const DEBUG = false

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { guild } = params

  const localData = guilds.find((i) => i.urlName === guild)

  const guildData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetchGuild(guild?.toString())

  if (!guildData) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      guildData,
    },
  }
}

export default GuildEditPageWrapper
