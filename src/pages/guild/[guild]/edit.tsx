import { HStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import EditForm from "components/[guild]/EditForm"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"

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
  const { name, description, imageUrl, requirements, logic } = useGuild()
  const formReset = useMemo(
    () => ({
      name,
      description,
      imageUrl,
      logic,
      requirements: requirements.map((requirement) => ({
        type: requirement.type,
        chain: requirement.chain,
        address: requirement.address,
        key: requirement.key,
        value: tryToParse(requirement.value),
      })),
    }),
    [name, description, imageUrl, logic, requirements]
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

const GuildEditPageWrapper = (): JSX.Element => {
  const data = useGuild()

  if (!data) return null

  return <GuildEditPage />
}

export default GuildEditPageWrapper
