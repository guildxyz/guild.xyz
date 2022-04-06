import {
  Alert,
  AlertDescription,
  AlertTitle,
  FormControl,
  GridItem,
  Heading,
  ListItem,
  Select,
  SimpleGrid,
  Stack,
  UnorderedList,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import FormErrorMessage from "components/common/FormErrorMessage"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useServerData from "components/create-guild/PickRolePlatform/components/Discord/hooks/useServerData"
import DCServerCard from "components/guard/setup/DCServerCard"
import PickMode from "components/guard/setup/PickMode"
import ExplorerCardMotionWrapper from "components/index/ExplorerCardMotionWrapper"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import useSWR from "swr"

const Page = (): JSX.Element => {
  const router = useRouter()

  // TODO: form type
  const methods = useForm<any>({
    mode: "all",
    defaultValues: {
      serverId: undefined,
    },
  })

  const { data: servers } = useSWR("usersServers", null, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  })

  useEffect(() => {
    if (router.isReady && !Array.isArray(servers)) {
      router.push("/guard")
    }
  }, [servers, router])

  const selectedServer = useWatch({
    control: methods.control,
    name: "serverId",
  })

  const filteredServers = useMemo(
    () =>
      selectedServer
        ? servers.filter((server) => server.value == selectedServer)
        : servers ?? [],
    [selectedServer, servers]
  )

  const {
    data: { channels },
  } = useServerData(selectedServer, {
    refreshInterval: 0,
  })

  const dynamicTitle = useMemo(
    () => (selectedServer ? "Set up Guild Guard" : "Select a server"),
    [selectedServer]
  )

  const resetForm = () => {
    methods.reset({
      serverId: undefined,
      channelId: undefined,
      grantAccessToExistingUsers: "false",
    })
    methods.setValue("serverId", null)
  }

  return (
    <Layout title={dynamicTitle}>
      <FormProvider {...methods}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
          <AnimateSharedLayout>
            <AnimatePresence>
              {filteredServers.map((serverData) => (
                <ExplorerCardMotionWrapper key={serverData.value}>
                  <GridItem>
                    <DCServerCard
                      serverData={serverData}
                      onSelect={
                        selectedServer
                          ? undefined
                          : (newServerId) =>
                              methods.setValue("serverId", newServerId)
                      }
                      onCancel={() => resetForm()}
                    />
                  </GridItem>
                </ExplorerCardMotionWrapper>
              ))}

              {selectedServer && (
                <GridItem colSpan={2}>
                  <ExplorerCardMotionWrapper>
                    <Card px={{ base: 5, sm: 6 }} py={7}>
                      <Stack spacing={8}>
                        <Heading as="h3" fontFamily="display" fontSize="3xl">
                          Activate your Guard
                        </Heading>

                        <Section title="Entry channel">
                          <FormControl
                            isInvalid={!!methods?.formState?.errors?.channelId}
                            isDisabled={!channels?.length}
                            defaultValue={channels?.[0]?.id}
                          >
                            <Select
                              maxW="50%"
                              {...methods?.register("channelId", {
                                required: "This field is required.",
                              })}
                            >
                              {channels?.map((channel, i) => (
                                <option
                                  key={channel.id}
                                  value={channel.id}
                                  defaultChecked={i === 0}
                                >
                                  {channel.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>
                              {methods?.formState?.errors?.channelId?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </Section>

                        <Section title="Security level">
                          <PickMode />
                        </Section>

                        <Alert colorScheme="gray">
                          <Stack spacing={4}>
                            <AlertTitle>Disclaimer</AlertTitle>
                            <AlertDescription fontSize="sm">
                              <UnorderedList>
                                <ListItem>
                                  Ethereum wallet is required for authentication
                                </ListItem>
                                <ListItem>
                                  You are hiding your members and server from
                                  unverified users
                                </ListItem>
                                <ListItem>
                                  Guild Guard protects your server from bots, not
                                  from humans with malicious intent
                                </ListItem>
                              </UnorderedList>
                            </AlertDescription>
                          </Stack>
                        </Alert>

                        <SimpleGrid columns={2} gap={4}>
                          <Button colorScheme="gray" disabled>
                            Connect wallet
                          </Button>
                          <Button colorScheme="green">Let's go!</Button>
                        </SimpleGrid>
                      </Stack>
                    </Card>
                  </ExplorerCardMotionWrapper>
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

export default Page
