import { Box, HStack, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import EditButtonGroup from "components/common/EditButtonGroup"
import Layout from "components/common/Layout"
import { GroupProvider, useGroup } from "components/[group]/Context"
import EditForm from "components/[group]/EditForm"
import { fetchGroup } from "components/[group]/utils/fetchGroup"
import useIsOwner from "components/[guild]/hooks/useIsOwner"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useSWR from "swr"

const GroupEditPage = (): JSX.Element => {
  const { colorMode } = useColorMode()
  const { account } = useWeb3React()
  const isOwner = useIsOwner(account)
  const { id, name, imageUrl, guilds, theme } = useGroup()
  const formReset = useMemo(
    () => ({
      name,
      imageUrl,
      guilds: guilds.map((guildData) => guildData.guild.id),
      theme: theme[0],
    }),
    [name, imageUrl, guilds, theme]
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
        title="Edit Group"
        action={
          <HStack spacing={2}>
            {isOwner && <EditButtonGroup editMode simple />}
          </HStack>
        }
        background={
          <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h={48}
            bgColor={"primary.500"}
            opacity={colorMode === "light" ? 1 : 0.5}
          />
        }
      >
        <EditForm />
      </Layout>
    </FormProvider>
  )
}

const GroupEditPageWrapper = (): JSX.Element => {
  const router = useRouter()
  const { data } = useSWR(["guild", router.query.group], fetchGroup)

  if (!data) return null

  return (
    <GroupProvider data={data}>
      <GroupEditPage />
    </GroupProvider>
  )
}

export default GroupEditPageWrapper
