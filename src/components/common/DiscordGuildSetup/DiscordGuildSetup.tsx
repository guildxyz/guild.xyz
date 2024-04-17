import { GridItem, SimpleGrid } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import ErrorAlert from "components/common/ErrorAlert"
import { AnimatePresence } from "framer-motion"
import useDebouncedState from "hooks/useDebouncedState"
import useGateables from "hooks/useGateables"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { PlatformType } from "types"
import { OptionSkeletonCard } from "../OptionCard"
import ReconnectAlert from "../ReconnectAlert"
import DCServerCard from "./components/DCServerCard"
import ServerSetupCard from "./components/ServerSetupCard"

const DiscordGuildSetup = ({
  defaultValues,
  selectedServer,
  fieldName,
  rolePlatforms = undefined,
  onSubmit = undefined,
}) => {
  const { reset, setValue } = useFormContext()

  const {
    gateables,
    isLoading,
    error: gateablesError,
  } = useGateables(PlatformType.DISCORD, {
    refreshInterval: 10_000,
  })

  const servers = Object.entries(gateables || {}).map(([id, serverData]) => ({
    id,
    ...serverData,
  }))

  const selectedServerOption = useMemo(
    () => servers?.find((server) => server.id === selectedServer),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedServer] // servers excluded on purpose
  )

  const debounceSelectedServer = useDebouncedState(selectedServer, 300)

  const resetForm = () => {
    reset(defaultValues)
    setValue(fieldName, null)
  }

  const guild = useGuild()

  const guildPlatformsOfRole = guild?.guildPlatforms?.filter((gp) =>
    rolePlatforms?.some((rp) => rp.guildPlatformId === gp.id)
  )

  if (gateablesError) {
    return <ReconnectAlert platformName="DISCORD" />
  }

  if ((!servers || servers.length <= 0) && isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 5 }}>
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
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }}>
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
            <DCServerCard
              key={serverData.id}
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
          ))}
      </AnimatePresence>
      {debounceSelectedServer && (
        <GridItem>
          <ServerSetupCard onSubmit={onSubmit} />
        </GridItem>
      )}
    </SimpleGrid>
  )
}

export default DiscordGuildSetup
