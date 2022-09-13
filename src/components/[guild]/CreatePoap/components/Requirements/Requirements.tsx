import {
  Box,
  Collapse,
  Divider,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Switch from "components/common/Switch"
import useGuild from "components/[guild]/hooks/useGuild"
import { CircleWavyCheck, UserCircleMinus } from "phosphor-react"
import { useState } from "react"
import { useCreatePoapContext } from "../CreatePoapContext"
import MonetizePoap from "./components/MonetizePoap"
import VoiceParticipation from "./components/VoiceParticipation"
import usePoapEventDetails from "./components/VoiceParticipation/hooks/usePoapEventDetails"

const Requirements = (): JSX.Element => {
  const { poaps } = useGuild()
  const { poapData, nextStep } = useCreatePoapContext()
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapData?.id)
  const { poapEventDetails } = usePoapEventDetails(poapData?.id)

  const [isMonetizationOpened, setIsMonetizationOpened] = useState(false)
  const [isVoiceOpened, setIsVoiceOpened] = useState(false)

  return (
    <>
      <Stack spacing={8} divider={<Divider />} mb={16}>
        <Stack>
          <Switch
            title={
              <HStack justifyContent="space-between">
                <Text fontWeight="bold">Payment</Text>
                <Icon as={CircleWavyCheck} boxSize={5} />
              </HStack>
            }
            description="Users will have to be in a voice channel at the time of the event"
            onChange={(e) => setIsMonetizationOpened(e.target.checked)}
            colorScheme="green"
            sx={{
              ".chakra-switch__label": {
                width: "100%",
              },
            }}
            disabled={guildPoap?.poapContracts?.length > 0}
            defaultChecked={guildPoap?.poapContracts?.length > 0}
          />
          <Collapse
            in={isMonetizationOpened || guildPoap?.poapContracts?.length > 0}
          >
            <Box pl={10} py={2}>
              <MonetizePoap />
            </Box>
          </Collapse>
        </Stack>

        <Stack>
          <Switch
            title={
              <HStack justifyContent="space-between">
                <Text fontWeight="bold">Voice participation</Text>
                <Icon as={UserCircleMinus} boxSize={5} />
              </HStack>
            }
            description="Users will have to be in a voice channel at the time of the event"
            onChange={(e) => setIsVoiceOpened(e.target.checked)}
            colorScheme="green"
            sx={{
              ".chakra-switch__label": {
                width: "100%",
              },
            }}
            disabled={!!poapEventDetails?.voiceRequirement}
            defaultChecked={!!poapEventDetails?.voiceRequirement}
          />
          <Collapse in={isVoiceOpened || !!poapEventDetails?.voiceRequirement}>
            <Box pl={10} py={2}>
              <VoiceParticipation />
            </Box>
          </Collapse>
        </Stack>
      </Stack>

      <Flex justifyContent="end">
        <Button onClick={nextStep}>Continue to distribution</Button>
      </Flex>
    </>
  )
}

export default Requirements
