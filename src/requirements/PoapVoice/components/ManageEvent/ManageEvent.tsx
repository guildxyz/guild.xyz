import {
  Box,
  HStack,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import useToast from "hooks/useToast"
import { Check, Record, SpeakerHigh, StopCircle, Timer } from "phosphor-react"
import { useEffect, useMemo, useState } from "react"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import useVoiceChannels from "requirements/PoapVoice/hooks/useVoiceChannels"
import { PlatformType } from "types"
import EligibleMembers from "./components/EligibleMembers"
import useVoiceParticipants from "./components/EligibleMembers/hooks/useVoiceParticipants"
import useManageEvent from "./hooks/useManageEvent"

const ManageEvent = ({ poapId }): JSX.Element => {
  const { id: guildId, guildPlatforms } = useGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // TODO: only works if there's only one Discord reward in the guild
  const discordGuildPlatform = guildPlatforms?.find(
    (platform) => platform.platformId === PlatformType.DISCORD
  )

  const { poapEventDetails, mutatePoapEventDetails } = usePoapEventDetails(poapId)
  const { mutateVoiceParticipants } = useVoiceParticipants(poapId)

  const { data: dcServerData } = useServerData(discordGuildPlatform?.platformGuildId)
  const { voiceChannels } = useVoiceChannels(discordGuildPlatform?.platformGuildId)

  const voiceChannelName = voiceChannels?.find(
    (c) => c.id === poapEventDetails?.voiceChannelId
  )?.name

  const onSuccess = (response) => {
    toast({
      status: "success",
      title: `Monitoring ${response.started ? "started" : "ended"}!`,
    })
    mutateVoiceParticipants()
    mutatePoapEventDetails()
  }

  const { onSubmit, isLoading } = useManageEvent({ onSuccess })

  const startTimeInMs = (poapEventDetails?.voiceEventStartedAt ?? 0) * 1000

  const [time, setTime] = useState(null)

  const sumTime = useMemo(() => {
    if (
      !poapEventDetails?.voiceEventStartedAt ||
      !poapEventDetails?.voiceEventEndedAt
    )
      return undefined

    return new Date(
      (poapEventDetails?.voiceEventEndedAt - poapEventDetails?.voiceEventStartedAt) *
        1000
    )
      .toISOString()
      .slice(11, 19)
  }, [poapEventDetails])

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
    <>
      <Button
        size="xs"
        borderRadius="lg"
        onClick={onOpen}
        leftIcon={sumTime ? <Check /> : <Record />}
        colorScheme={startTimeInMs && !sumTime ? "red" : "gray"}
      >
        {sumTime
          ? "Monitoring ended"
          : startTimeInMs
          ? "Manage monitoring..."
          : "Start monitoring..."}
      </Button>
      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Monitor voice participation</ModalHeader>
          <ModalBody>
            <Skeleton as="span" isLoaded={Boolean(dcServerData && voiceChannelName)}>
              <HStack mb={4}>
                <Text
                  as="span"
                  fontWeight="medium"
                  colorScheme={"gray"}
                  fontSize="sm"
                >
                  {dcServerData?.serverName ?? discordGuildPlatform?.platformGuildId}
                </Text>
                <Text
                  as="span"
                  fontWeight="medium"
                  colorScheme={"gray"}
                  fontSize="sm"
                >
                  {" / "}
                </Text>
                <Text as="span" fontWeight="bold" colorScheme={"gray"} fontSize="sm">
                  <Icon as={SpeakerHigh} mb="-2px" />
                  {` ${voiceChannelName ?? poapEventDetails?.voiceChannelId}`}
                </Text>
              </HStack>
            </Skeleton>
            <HStack mb={4}>
              <Icon as={Timer} boxSize="10" />
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  {sumTime ?? time ?? "00:00:00"}
                </Text>
                {/* <Text fontWeight="semibold" fontSize="sm" colorScheme="gray">
                  {new Date(startTimeInMs).toLocaleTimeString([], {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(
                    poapEventDetails?.voiceEventEndedAt * 1000
                  ).toLocaleTimeString([], {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text> */}
              </Box>
              <Spacer />
              <EligibleMembers poapId={poapId} />
            </HStack>
            <HStack w="full" pt="6">
              <Button
                w="full"
                h="10"
                leftIcon={
                  !sumTime && <Icon as={startTimeInMs ? StopCircle : Record} />
                }
                colorScheme={sumTime ? "gray" : startTimeInMs ? "red" : "indigo"}
                onClick={() =>
                  onSubmit({
                    guildId,
                    poapId,
                    action: startTimeInMs ? "STOP" : "START",
                  })
                }
                isLoading={isLoading}
                isDisabled={sumTime}
                loadingText="Please wait"
              >
                {sumTime
                  ? "Monitoring ended"
                  : startTimeInMs
                  ? "Stop monitoring"
                  : "Start monitoring"}
              </Button>
              {/* <Button
                size="sm"
                borderRadius="lg"
                leftIcon={<Icon as={ArrowsCounterClockwise} />}
                isDisabled={!!poapEventDetails?.voiceEventEndedAt}
              >
                Reset
              </Button> */}
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ManageEvent
