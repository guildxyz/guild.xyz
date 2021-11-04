import { HStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import { HallProvider, useHall } from "components/[hall]/Context"
import EditForm from "components/[hall]/EditForm"
import { fetchHall } from "components/[hall]/utils/fetchHall"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useSWR from "swr"

const HallEditPage = (): JSX.Element => {
  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const { name, description, imageUrl, guilds, theme } = useHall()
  const formReset = useMemo(
    () => ({
      name,
      description,
      imageUrl,
      guilds: guilds.map((guildData) => guildData.guild.id),
      theme: theme[0],
    }),
    [name, description, imageUrl, guilds, theme]
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
        title="Edit Hall"
        action={
          <HStack spacing={2}>{isOwner && <EditButtonGroup editMode />}</HStack>
        }
      >
        <EditForm />
      </Layout>
    </FormProvider>
  )
}

const HallEditPageWrapper = (): JSX.Element => {
  const router = useRouter()
  const { data } = useSWR(["hall", router.query.hall], fetchHall)

  if (!data) return null

  return (
    <HallProvider data={data}>
      <HallEditPage />
    </HallProvider>
  )
}

export default HallEditPageWrapper
