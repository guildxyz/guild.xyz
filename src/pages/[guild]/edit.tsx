import { Alert, AlertDescription, AlertIcon, HStack, Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import EditRoleForm from "components/[guild]/EditRoleForm"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsOwner from "components/[role]/hooks/useIsOwner"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"

// If the `value` field of a requirement starts with a "[", we should try to parse it and use it as an array... (interval attribute)
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

  const guild = useGuild()

  const methods = useForm({
    mode: "all",
  })

  // Since we're fetching the data on mount, this is the "best" way to populate the form with default values.
  // https://github.com/react-hook-form/react-hook-form/issues/2492
  useEffect(() => {
    const roleData = guild?.roles?.[0]?.role
    if (!methods || !roleData) return

    const { imageUrl, name, description, logic, requirements } = roleData

    methods.reset({
      name,
      description,
      imageUrl,
      logic,
      requirements: requirements?.map((requirement) => ({
        type: requirement.type,
        chain: requirement.chain,
        address:
          requirement.type === "COIN"
            ? "0x0000000000000000000000000000000000000000"
            : requirement.address,
        key: requirement.key,
        value: tryToParse(requirement.value),
      })),
    })
  }, [methods, guild])

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
        {isOwner ? (
          <Section title="Roles">
            <EditRoleForm />
          </Section>
        ) : (
          <Alert status="error" mb="6" pb="5">
            <AlertIcon />
            <Stack>
              <AlertDescription position="relative" top={1} fontWeight="semibold">
                Seems like you aren't the owner of this guild!
              </AlertDescription>
            </Stack>
          </Alert>
        )}
      </Layout>
    </FormProvider>
  )
}

export default GuildEditPage
