import { GridItem, HStack, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ErrorAlert from "components/common/ErrorAlert"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import DCServerCard from "components/guard/setup/DCServerCard"
import ServerSetupCard from "components/guard/setup/ServerSetupCard"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import useUsersServers from "hooks/useUsersServers"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"

const defaultValues = {
  imageUrl: "/guildLogos/0.svg",
  platform: "DISCORD",
  isGuarded: true,
  DISCORD: {
    platformId: undefined,
  },
  channelId: undefined,
  grantAccessToExistingUsers: "false",
  requirements: [
    {
      type: "FREE",
    },
  ],
}

const Page = (): JSX.Element => {
  const router = useRouter()
  const authToken = router.query.authToken as string

  useEffect(() => {
    if (router.isReady && !router.query.authToken) {
      router.push("/guard")
    }
  }, [router])

  const { servers, isValidating } = useUsersServers(authToken)

  const methods = useFormContext()

  const selectedServer = useWatch({
    control: methods.control,
    name: "DISCORD.platformId",
  })

  const filteredServers = useMemo(
    () =>
      selectedServer
        ? servers.filter((server) => server.value == selectedServer)
        : servers ?? [],
    [selectedServer, servers]
  )

  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedServer)
      setTimeout(() => {
        setShowForm(true)
      }, 300)
    else setShowForm(false)
  }, [selectedServer])

  const resetForm = () => {
    methods.reset(defaultValues)
    methods.setValue("DISCORD.platformId", null)
  }

  return (
    <Layout title={selectedServer ? "Set up Guild Guard" : "Select a server"}>
      <FormProvider {...methods}>
        {(filteredServers.length <= 0 && isValidating) || !router.query.authToken ? (
          <HStack spacing="6" py="5">
            <Spinner size="md" />
            <Text fontSize="lg">Loading servers...</Text>
          </HStack>
        ) : filteredServers.length <= 0 ? (
          <ErrorAlert label="Seem like you're not an admin of any Discord server yet" />
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 5, md: 6 }}
          >
            <AnimateSharedLayout>
              <AnimatePresence>
                {filteredServers.map((serverData) => (
                  <CardMotionWrapper key={serverData.value}>
                    <GridItem>
                      <DCServerCard
                        serverData={serverData}
                        onSelect={
                          selectedServer
                            ? undefined
                            : (newServerId) =>
                                methods.setValue("DISCORD.platformId", newServerId)
                        }
                        onCancel={
                          selectedServer !== serverData.value
                            ? undefined
                            : () => resetForm()
                        }
                      />
                    </GridItem>
                  </CardMotionWrapper>
                ))}

                {showForm && (
                  <GridItem colSpan={2}>
                    <ServerSetupCard />
                  </GridItem>
                )}
              </AnimatePresence>
            </AnimateSharedLayout>
          </SimpleGrid>
        )}

        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </Layout>
  )
}

const WrappedPage = () => {
  // TODO: form type
  const methods = useForm<any>({
    mode: "all",
    defaultValues,
  })

  return (
    <FormProvider {...methods}>
      <Page />
    </FormProvider>
  )
}

export default WrappedPage
