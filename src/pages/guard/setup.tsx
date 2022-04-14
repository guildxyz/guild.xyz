import { GridItem, SimpleGrid } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import DCServerCard from "components/guard/setup/DCServerCard"
import ServerSetupCard from "components/guard/setup/ServerSetupCard"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import useSWR from "swr"

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

  const { data: servers } = useSWR("usersServers", null, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  })

  const methods = useFormContext()

  useEffect(() => {
    if (router.isReady && !Array.isArray(servers)) {
      router.push("/guard")
    }
  }, [servers, router])

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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
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
                      onCancel={() => resetForm()}
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
