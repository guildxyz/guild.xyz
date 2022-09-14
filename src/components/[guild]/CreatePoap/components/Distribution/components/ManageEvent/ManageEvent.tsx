import {
  Box,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import useToast from "hooks/useToast"
import { ArrowElbowDownRight, Info, Play, Stop, Timer } from "phosphor-react"
import { useEffect, useState } from "react"
import { useCreatePoapContext } from "../../../CreatePoapContext"
import usePoapEventDetails from "../../../Requirements/components/VoiceParticipation/hooks/usePoapEventDetails"
import useVoiceChannels from "../../../Requirements/components/VoiceParticipation/hooks/useVoiceChannels"
import EligibleMembers from "./components/EligibleMembers"
import useManageEvent from "./hooks/useManageEvent"

const ManageEvent = (): JSX.Element => {
  const { id: guildId } = useGuild()
  const { discordServerId } = useCreatePoapContext()
  const { voiceChannels } = useVoiceChannels(discordServerId)
  const { poapEventDetails, mutatePoapEventDetails } = usePoapEventDetails()
  const { data: dcServerData } = useServerData(discordServerId)

  const voiceChannelName = voiceChannels?.find(
    (c) => c.id === poapEventDetails?.voiceChannelId
  )?.name

  const { onSubmit, isLoading, response } = useManageEvent()
  const toast = useToast()

  useEffect(() => {
    if (!response) return
    toast({
      status: "success",
      title: `Event ${response.started ? "started" : "ended"}!`,
    })
    mutatePoapEventDetails()
  }, [response])

  const startTimeInMs = (poapEventDetails?.voiceEventStartedAt ?? 0) * 1000

  const [time, setTime] = useState(null)

  const sumTime =
    poapEventDetails?.voiceEventStartedAt && poapEventDetails?.voiceEventEndedAt
      ? new Date(
          (poapEventDetails?.voiceEventEndedAt -
            poapEventDetails?.voiceEventStartedAt) *
            1000
        )
          .toISOString()
          .slice(11, 19)
      : undefined

  useEffect(() => {
    let interval

    if (startTimeInMs && !sumTime) {
      interval = setInterval(() => {
        setTime(new Date(Date.now() - startTimeInMs).toISOString().slice(11, 19))
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [startTimeInMs, poapEventDetails])

  return (
    <Card position="relative" px={6} py={7} maxW="sm">
      <Box position="absolute" top={9} right={6}>
        <Tooltip label="Not associated with your Discord event!">
          <Icon as={Info} />
        </Tooltip>
      </Box>

      <Stack spacing={0.5} mb={2}>
        <Skeleton as="span" isLoaded={!!dcServerData}>
          <Text
            as="span"
            fontFamily="display"
            fontWeight="bold"
            letterSpacing="wide"
            fontSize="xl"
          >
            {dcServerData?.serverName ?? discordServerId}
          </Text>
        </Skeleton>

        <Skeleton as="span" isLoaded={!!voiceChannelName}>
          <Icon as={ArrowElbowDownRight} color="gray" mr={1} />
          <Text
            as="span"
            fontFamily="display"
            fontWeight="bold"
            letterSpacing="wide"
            color="gray"
          >
            {`#${voiceChannelName ?? poapEventDetails?.voiceChannelId}`}
          </Text>
        </Skeleton>
      </Stack>

      <HStack mb={4}>
        <Icon as={Timer} />
        <Text fontWeight="bold">{sumTime ?? time ?? "00:00:00"}</Text>
        <EligibleMembers />
      </HStack>

      <Wrap>
        <Button
          size="sm"
          borderRadius="lg"
          leftIcon={!sumTime && <Icon as={startTimeInMs ? Stop : Play} />}
          colorScheme={sumTime ? "gray" : startTimeInMs ? "red" : "indigo"}
          onClick={() =>
            onSubmit({
              guildId,
              poapId: poapEventDetails?.poapIdentifier,
              action: startTimeInMs ? "STOP" : "START",
            })
          }
          isLoading={isLoading}
          isDisabled={sumTime}
          loadingText="Please wait"
        >
          {sumTime ? "Event ended" : startTimeInMs ? "Stop event" : "Start event"}
        </Button>

        {/* <Button
            size="sm"
            borderRadius="lg"
            leftIcon={<Icon as={ArrowsCounterClockwise} />}
            isDisabled={!!poapEventDetails?.voiceEventEndedAt}
          >
            Reset
          </Button> */}
      </Wrap>
    </Card>
  )
}

export default ManageEvent
