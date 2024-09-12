import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { GridItem, SimpleGrid } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import useGuild from "components/[guild]/hooks/useGuild"
import ErrorAlert from "components/common/ErrorAlert"
import { AnimatePresence } from "framer-motion"
import useDebouncedState from "hooks/useDebouncedState"
import useGateables, { Gateables } from "hooks/useGateables"
import { useEffect, useMemo, useState } from "react"
import { PlatformType } from "types"
import { OptionSkeletonCard } from "../OptionCard"
import ReconnectAlert from "../ReconnectAlert"
import DCServerCard from "./components/DCServerCard"
import ServerSetupCard from "./components/ServerSetupCard"

type DiscordGateable = Gateables[PlatformType.DISCORD][number]

type Props = {
  onSubmit: (selectedServer: DiscordGateable) => void
  rolePlatforms?: any[] // Low prio todo: proper typing
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
}: Props) => {
  const [selectedServer, setSelectedServer] = useState<DiscordGateable>()
  useAddRewardDiscardAlert(!!selectedServer)

  const { captureEvent } = usePostHogContext()
  const { id } = useGuild()

  const {
    gateables: unorderedServers,
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
  const servers = unorderedServers?.sort(
    (a, b) =>
      // Order servers, which are already used in the guild to the very top, then other selectable ones, then the guilded ones
      +a.isGuilded +
      +(b.isGuilded && b.guildId === id) * 2 -
      (+b.isGuilded + +(a.isGuilded && a.guildId === id) * 2)
  )

  const selectedServerOption = useMemo(
    () => servers?.find((server) => server.id === selectedServer?.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedServer] // servers excluded on purpose
  )

  const debounceSelectedServer = useDebouncedState(selectedServer, 300)

  const resetForm = () => {
    setSelectedServer(undefined)
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
        {(selectedServerOption ? [selectedServerOption] : (servers ?? []))
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
              isSelected={selectedServer?.id === serverData.id}
              onCancel={resetForm}
              onSelect={() => {
                captureEvent("[discord setup] selected server")
                setSelectedServer(serverData)
              }}
              onSubmit={() => {
                captureEvent("[discord setup] server added")
                onSubmit(serverData)
              }}
              serverData={serverData}
            />
          ))}
      </AnimatePresence>
      {debounceSelectedServer && (
        <GridItem>
          <ServerSetupCard
            serverId={selectedServer?.id}
            onSubmit={() => {
              captureEvent("[discord setup] server added")
              onSubmit(selectedServer)
            }}
          />
        </GridItem>
      )}
    </SimpleGrid>
  )
}

export default DiscordGuildSetup
