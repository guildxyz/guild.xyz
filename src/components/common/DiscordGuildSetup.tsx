import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  GridItem,
  HStack,
  SimpleGrid,
  Text,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ErrorAlert from "components/common/ErrorAlert"
import DCServerCard from "components/guard/setup/DCServerCard"
import ServerSetupCard from "components/guard/setup/ServerSetupCard"
import useGuild from "components/[guild]/hooks/useGuild"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { AnimatePresence } from "framer-motion"
import useGateables from "hooks/useGateables"
import useIsConnected from "hooks/useIsConnected"
import { useEffect, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { OptionSkeletonCard } from "./OptionCard"

const DiscordGuildSetup = ({
  defaultValues,
  selectedServer,
  fieldName,
  children,
  rolePlatforms = undefined,
  onSubmit = undefined,
}) => {
  const { reset, setValue } = useFormContext()

  const isConnected = useIsConnected("DISCORD")

  const {
    gateables,
    isLoading,
    error: gateablesError,
    mutate,
  } = useGateables("DISCORD")

  const servers = Object.entries(gateables || {}).map(([id, serverData]) => ({
    id,
    ...serverData,
  }))

  const selectedServerOption = useMemo(
    () => servers?.find((server) => server.id === selectedServer),
    [selectedServer] // servers excluded on purpose
  )

  const [showForm, setShowForm] = useState(false)

  const {
    onConnect,
    isLoading: isConnecting,
    loadingText,
  } = useConnectPlatform("DISCORD", () => mutate(), true)

  useEffect(() => {
    if (selectedServer)
      setTimeout(() => {
        setShowForm(true)
      }, 300)
    else setShowForm(false)
  }, [selectedServer])

  const resetForm = () => {
    reset(defaultValues)
    setValue(fieldName, null)
  }

  const guild = useGuild()

  const guildPlatformsOfRole = guild?.guildPlatforms?.filter((gp) =>
    rolePlatforms?.some((rp) => rp.guildPlatformId === gp.id)
  )

  if (gateablesError) {
    return (
      <Alert status="error" mb="6" pb="5">
        <AlertIcon />
        <AlertDescription fontWeight="semibold" w="full">
          <HStack justifyContent={"space-between"} w="full">
            <Text>Discord connection error, please reconnect</Text>
            <Button
              size="sm"
              onClick={onConnect}
              isLoading={isConnecting}
              loadingText={loadingText ?? "Loading"}
            >
              Reconnect
            </Button>
          </HStack>
        </AlertDescription>
      </Alert>
    )
  }

  if (((!servers || servers.length <= 0) && isLoading) || !isConnected) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
        {[...Array(3)].map((i) => (
          <GridItem key={i}>
            <OptionSkeletonCard />
          </GridItem>
        ))}
      </SimpleGrid>
    )
  }

  if (servers?.length <= 0) {
    return (
      <ErrorAlert label="Seem like you're not an admin of any Discord server yet" />
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
      <AnimatePresence>
        {(selectedServerOption ? [selectedServerOption] : servers ?? [])
          .filter(
            guildPlatformsOfRole
              ? (serverData) =>
                  guildPlatformsOfRole?.every(
                    (gp) => gp.platformGuildId != serverData.id
                  )
              : () => true
          )
          .map((serverData) => (
            <CardMotionWrapper key={serverData.id}>
              <GridItem>
                <DCServerCard
                  serverData={serverData}
                  onSelect={
                    selectedServer
                      ? undefined
                      : (newServerId) => setValue(fieldName, newServerId)
                  }
                  onCancel={
                    selectedServer !== serverData.id ? undefined : () => resetForm()
                  }
                />
              </GridItem>
            </CardMotionWrapper>
          ))}
      </AnimatePresence>
      {showForm && (
        <GridItem colSpan={2}>
          <ServerSetupCard onSubmit={onSubmit}>{children}</ServerSetupCard>
        </GridItem>
      )}
    </SimpleGrid>
  )
}

export default DiscordGuildSetup
