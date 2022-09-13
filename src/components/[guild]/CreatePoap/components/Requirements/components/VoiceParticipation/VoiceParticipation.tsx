import {
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import { useEffect } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import { VoiceParticipationForm } from "types"
import useVoiceChannels from "./hooks/useVoiceChannels"

const voiceRequirementTypeOptions = [
  {
    value: "PERCENT",
    name: "%",
  },
  {
    value: "MINUTE",
    name: "min",
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

  const {
    control,
    register,
    getValues,
    formState: { errors },
    trigger,
    handleSubmit,
  } = methods

  const { voiceChannels } = useVoiceChannels(discordServerId)

  const voiceRequirementType = useWatch({ control, name: "voiceRequirement.type" })

  useEffect(() => {
    trigger("voiceRequirement.percentOrMinute")
  }, [voiceRequirementType])

  return (
    <FormProvider {...methods}>
      <Stack spacing={4}>
        <FormControl maxW={64} isRequired isInvalid={!!errors?.voiceChannelId}>
          <FormLabel>Event's voice channel:</FormLabel>

          {voiceChannels?.length <= 0 ? (
            <Button isDisabled isLoading loadingText="Loading channels" w="full" />
          ) : (
            <Select
              {...register("voiceChannelId", {
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

          <FormErrorMessage>{errors?.voiceChannelId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          maxW="sm"
          isRequired
          isInvalid={!!errors?.voiceRequirement?.percentOrMinute}
        >
          <FormLabel>Voice requirement:</FormLabel>

          <HStack spacing={0} maxW={64}>
            <Controller
              name="voiceRequirement.percentOrMinute"
              control={control}
              rules={{
                required: "This field is required.",
                min: {
                  value: 0,
                  message: "Must be positive",
                },
                max:
                  getValues("voiceRequirement.type") === "PERCENT"
                    ? {
                        value: 100,
                        message: "Maximum is 100%",
                      }
                    : undefined,
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumberInput
                  ref={ref}
                  value={value ?? undefined}
                  onChange={onChange}
                  onBlur={onBlur}
                  min={0}
                  sx={{
                    "> input": {
                      borderRightRadius: 0,
                    },
                    "div div:first-of-type": {
                      borderTopRightRadius: 0,
                    },
                    "div div:last-of-type": {
                      borderBottomRightRadius: 0,
                    },
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />

            <Select
              {...register("voiceRequirement.type")}
              borderLeftRadius={0}
              maxW={24}
              _invalid={{
                borderColor: undefined,
              }}
            >
              {voiceRequirementTypeOptions.map((option, index) => (
                <option
                  key={option.value}
                  value={option.value}
                  defaultChecked={index === 0}
                >
                  {option.name}
                </option>
              ))}
            </Select>
          </HStack>

          <FormErrorMessage>
            {errors?.voiceRequirement?.percentOrMinute?.message}
          </FormErrorMessage>
        </FormControl>

        {/* TODO: move this to the PoapListItem component and also simplify it! */}
        {/* <Section title="Manage event">
          <Timer />
        </Section> */}
      </Stack>
      <Button
        mt={8}
        colorScheme="indigo"
        maxW="max-content"
        onClick={handleSubmit(console.log, console.log)}
      >
        Save voice requirement
      </Button>
      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default VoiceParticipation
