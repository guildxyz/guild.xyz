import { Flex, Spinner, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { Coin, SpeakerHigh } from "phosphor-react"
import { useState } from "react"
import { useCreatePoapContext } from "../CreatePoapContext"
import CheckboxColorCard from "./components/CheckboxColorCard"
import MonetizePoap from "./components/MonetizePoap"
import VoiceParticipation from "./components/VoiceParticipation"
import usePoapEventDetails from "./components/VoiceParticipation/hooks/usePoapEventDetails"

const Requirements = (): JSX.Element => {
  const { poaps, isLoading } = useGuild()
  const { poapData, nextStep } = useCreatePoapContext()
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapData?.id)
  const { poapEventDetails, isPoapEventDetailsLoading } = usePoapEventDetails()

  const [shouldOpenMonetizationModal, setShouldOpenMonetizationModal] =
    useState(false)

  return (
    <>
      {isLoading || isPoapEventDetailsLoading ? (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      ) : guildPoap?.activated ? (
        <Text>
          You can't set requirements, because you've already started distributing
          your POAP.
        </Text>
      ) : (
        <>
          <Stack spacing={4} mb={16}>
            <CheckboxColorCard
              icon={Coin}
              title="Payment"
              description="Monetize POAP (you can set multiple payment methods that users will be able to choose from)"
              colorScheme="blue"
              isDisabled={guildPoap?.poapContracts?.length > 0}
              defaultChecked={guildPoap?.poapContracts?.length > 0}
              onChange={(e) => setShouldOpenMonetizationModal(e.target.checked)}
            >
              <MonetizePoap shouldOpenModal={shouldOpenMonetizationModal} />
            </CheckboxColorCard>

            <CheckboxColorCard
              icon={SpeakerHigh}
              title="Voice participation"
              description="Users will have to be in a voice channel at the time of the event"
              colorScheme="yellow"
              isDisabled={!!poapEventDetails?.voiceRequirement}
              defaultChecked={!!poapEventDetails?.voiceRequirement}
            >
              <VoiceParticipation />
            </CheckboxColorCard>
          </Stack>

          <Flex justifyContent="end">
            <Button onClick={nextStep}>Continue to distribution</Button>
          </Flex>
        </>
      )}
    </>
  )
}

export default Requirements
