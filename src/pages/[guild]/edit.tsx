import { Alert, AlertDescription, AlertIcon, HStack, Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import EditRoleForm from "components/[guild]/EditRoleForm"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsOwner from "components/[role]/hooks/useIsOwner"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useMemo } from "react"
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

  const formReset = useMemo(() => {
    const roleData = guild?.roles?.[0]?.role

    if (!roleData) return {}

    const { imageUrl, name, description, logic, requirements } = roleData

    return {
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
    }
  }, [guild])

  const methods = useForm({
    mode: "all",
    defaultValues: { ...formReset },
  })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  if (!guild) return null

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
