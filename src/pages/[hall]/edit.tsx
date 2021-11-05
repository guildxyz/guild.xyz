import { HStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { ColorProvider } from "components/common/ColorContext"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import EditForm from "components/[hall]/EditForm"
import useHall from "components/[hall]/hooks/useHall"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"

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
  const data = useHall()

  if (!data) return null

  return (
    <ColorProvider>
      <HallEditPage />
    </ColorProvider>
  )
}

export default HallEditPageWrapper
