import { FormControl, FormLabel, Select, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import RadioSelect from "components/common/RadioSelect"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import { Percent, Timer as TimerIcon } from "phosphor-react"
import { FormProvider, useController, useForm } from "react-hook-form"
import { VoiceParticipationForm } from "types"
import VoiceMinuteSettings from "./components/VoiceMinuteSettings"
import VoicePercentSettings from "./components/VoicePercentSettings"
import useVoiceChannels from "./hooks/useVoiceChannels"

const voiceRequirementTypeOptions = [
  {
    value: "PERCENT",
    title: "Percent",
    description:
      "Users should be in the event's voice channel for a specified precentage of the events time.",
    icon: Percent,
    children: <VoicePercentSettings />,
  },
  {
    value: "MINUTE",
    title: "Minutes",
    description:
      "Users should be in the event's voice channel for a specified time.",
    icon: TimerIcon,
    children: <VoiceMinuteSettings />,
  },
]

const VoiceParticipation = (): JSX.Element => {
  const { poapData, discordServerId } = useCreatePoapContext()

  const methods = useForm<VoiceParticipationForm>({
    mode: "all",
    defaultValues: {
      poapId: poapData?.id,
    },
  })

  const { control } = methods

  const { voiceChannels } = useVoiceChannels(discordServerId)

  const { field: voiceRequirementTypeField } = useController({
    control,
    name: "voiceRequirementType",
  })

  const handleVoiceRequirementTypeChange = (value) => {
    voiceRequirementTypeField.onChange(value)
    // TODO: clear percentage/minute inputs and errors if needed
  }

  return (
    <Stack spacing={8}>
      <FormProvider {...methods}>
        <FormControl
          maxW="sm"
          isRequired
          isInvalid={!!methods.formState.errors?.voiceChannelId}
        >
          <FormLabel>Event's voice channel:</FormLabel>

          {voiceChannels?.length <= 0 ? (
            <Button isDisabled isLoading loadingText="Loading channels" w="full" />
          ) : (
            <Select
              {...methods.register("voiceChannelId", {
                required: "This field is required ",
              })}
              maxW="sm"
            >
              {voiceChannels?.map((channel, index) => (
                <option
                  key={channel.id}
                  value={channel.id}
                  defaultChecked={index === 0}
                >
                  {channel.name}
                </option>
              ))}
            </Select>
          )}

          <FormErrorMessage>
            {methods.formState.errors?.voiceChannelId?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl maxW="lg">
          <FormLabel>Voice requirement type:</FormLabel>

          <RadioSelect
            options={voiceRequirementTypeOptions}
            colorScheme="indigo"
            name="voiceRequirementType"
            onChange={handleVoiceRequirementTypeChange}
            value={voiceRequirementTypeField.value}
          />
        </FormControl>

        {/* TODO: move this to the PoapListItem component and also simplify it! */}
        {/* <Section title="Manage event">
          <Timer />
        </Section> */}

        <Button colorScheme="indigo" maxW="max-content">
          Save voice requirement
        </Button>

        <DynamicDevTool control={control} />
      </FormProvider>
    </Stack>
  )
}

export default VoiceParticipation
