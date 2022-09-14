import { Flex, HStack, Spinner, Stack, Tag, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { Coin, SpeakerHigh } from "phosphor-react"
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

  return (
    <>
      {isLoading || isPoapEventDetailsLoading ? (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
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
            >
              <MonetizePoap />
            </CheckboxColorCard>

            <CheckboxColorCard
              icon={SpeakerHigh}
              title={
                <HStack>
                  <Text as="span" fontWeight="bold">
                    Voice participation
                  </Text>
                  <Tag size="sm">Coming soon</Tag>
                </HStack>
              }
              description="Users will have to be in a voice channel at the time of the event"
              colorScheme="orange"
              isDisabled={!!poapEventDetails?.voiceRequirement}
              defaultChecked={!!poapEventDetails?.voiceRequirement}
              comingSoon
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
