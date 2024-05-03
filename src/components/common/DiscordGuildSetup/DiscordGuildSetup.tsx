import { GridItem, SimpleGrid } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import ErrorAlert from "components/common/ErrorAlert"
import { AnimatePresence } from "framer-motion"
import useDebouncedState from "hooks/useDebouncedState"
import useGateables from "hooks/useGateables"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { PlatformType } from "types"
import { OptionSkeletonCard } from "../OptionCard"
import ReconnectAlert from "../ReconnectAlert"
import DCServerCard from "./components/DCServerCard"
import ServerSetupCard from "./components/ServerSetupCard"

const defaultValues = {
  platformGuildId: null,
  img: null,
  name: null,
}

function NotAdminError() {
  const { captureEvent } = usePostHogContext()

  useEffect(() => {
    captureEvent("[discord setup] error shown")

    return () => {
      captureEvent("[discord setup] error not shown")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ErrorAlert label="Seem like you're not an admin of any Discord server yet" />
  )
}

const DiscordGuildSetup = ({
  rolePlatforms = undefined,
  onSubmit = undefined,
  shouldHideGotItButton = false,
}) => {
  const { reset, setValue, handleSubmit, formState } = useForm({
    mode: "all",
    defaultValues,
  })
  useAddRewardDiscardAlert(formState.isDirty)

  const [selectedServer, setSelectedServer] = useState<string>()

  const { captureEvent } = usePostHogContext()

  const {
    gateables,
    isLoading,
    error: gateablesError,
  } = useGateables(PlatformType.DISCORD, {
    onSuccess: () => {
      captureEvent("[discord setup] gateables successful")
    },
    onError: () => {
      captureEvent("[discord setup] gateables failed, showing reconnect alert")
    },
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
    return <NotAdminError />
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
              onSelect={(newServerId, data) => {
                setSelectedServer(newServerId)

                setValue("platformGuildId", newServerId, { shouldDirty: true })
                setValue("name", data?.name, { shouldDirty: true })
                setValue("img", data?.img, { shouldDirty: true })

                // If the "Got It" button is not shown, the flow ends here, we call onSubmit with the new data
                if (shouldHideGotItButton) {
                  handleSubmit(onSubmit)()
                }
              }}
              onCancel={
                selectedServer !== serverData.id ? undefined : () => resetForm()
              }
            />
          ))}
      </AnimatePresence>
      {debounceSelectedServer && (
        <GridItem>
          <ServerSetupCard
            // If the "Got It" button is shown, we only call onSubmit when that is pressed
            onSubmit={!shouldHideGotItButton ? handleSubmit(onSubmit) : undefined}
          />
        </GridItem>
      )}
    </SimpleGrid>
  )
}

export default DiscordGuildSetup
