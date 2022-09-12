import { Box, Collapse, Flex, HStack, Icon, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import Switch from "components/common/Switch"
import { CircleWavyCheck, UserCircleMinus } from "phosphor-react"
import { useState } from "react"
import { useCreatePoapContext } from "../CreatePoapContext"
import MonetizePoap from "./components/MonetizePoap"
import VoiceParticipation from "./components/VoiceParticipation"

const Requirements = (): JSX.Element => {
  const { nextStep } = useCreatePoapContext()

  const [isMonetizationOpened, setIsMonetizationOpened] = useState(false)
  const [isVoiceOpened, setIsVoiceOpened] = useState(false)

  return (
    <Stack spacing={12}>
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
        />
        <Collapse in={isMonetizationOpened}>
          <Box pl={10} pt={2}>
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
        />
        <Collapse in={isVoiceOpened}>
          <Box pl={10} pt={2}>
            <VoiceParticipation />
          </Box>
        </Collapse>
      </Stack>

      <Flex justifyContent="end">
        <Button onClick={nextStep}>Continue to distribution</Button>
      </Flex>
    </Stack>
  )
}

export default Requirements
