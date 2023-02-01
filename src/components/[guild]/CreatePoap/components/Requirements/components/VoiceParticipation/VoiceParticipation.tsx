import {
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import { TrashSimple } from "phosphor-react"
import { useEffect } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import { VoiceParticipationForm } from "types"
import useDeleteVoiceRequirement from "./hooks/useDeleteVoiceRequirement"
import useEditVoiceRequirement from "./hooks/useEditVoiceRequirement"
import usePoapEventDetails from "./hooks/usePoapEventDetails"
import useSetVoiceRequirement from "./hooks/useSetVoiceRequirement"
import useVoiceChannels from "./hooks/useVoiceChannels"

const voiceRequirementTypeOptions = [
  {
    value: "PERCENT",
    name: "%",
  },
  {
    value: "MINUTE",
    name: "minutes",
  },
]

const VoiceParticipation = (): JSX.Element => {
  const { poapData, discordServerId } = useCreatePoapContext()
  const { poapEventDetails } = usePoapEventDetails()

  const methods = useForm<VoiceParticipationForm>({
    mode: "all",
  })

  useEffect(() => {
    if (!poapData || !poapEventDetails?.voiceChannelId) return
    methods.reset({
      poapId: poapData.id,
      voiceChannelId: poapEventDetails.voiceChannelId,
      voiceRequirement: {
        percentOrMinute:
          poapEventDetails?.voiceRequirement?.minute ??
          poapEventDetails?.voiceRequirement?.percent,
        type: poapEventDetails?.voiceRequirement?.minute ? "MINUTE" : "PERCENT",
      },
    })
  }, [poapData, poapEventDetails])

  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors, touchedFields, isDirty },
    trigger,
    handleSubmit,
  } = methods

  const { voiceChannels } = useVoiceChannels(discordServerId)

  const voiceRequirementType = useWatch({ control, name: "voiceRequirement.type" })

  useEffect(() => {
    if (!touchedFields.voiceRequirement?.percentOrMinute) return
    trigger("voiceRequirement.percentOrMinute")
  }, [voiceRequirementType])

  const channelId = useWatch({ control, name: "voiceChannelId" })

  useEffect(() => {
    if (!voiceChannels?.length) return
    if (!voiceChannels.some(({ id }) => id === poapEventDetails?.voiceChannelId)) {
      setValue("voiceChannelId", voiceChannels[0].id)
    } else if (!channelId)
      setValue("voiceChannelId", poapEventDetails.voiceChannelId)
  }, [voiceChannels, poapEventDetails])

  const { onSubmit, isLoading } = useSetVoiceRequirement()
  const { onSubmit: onEditSubmit, isLoading: isEditLoading } =
    useEditVoiceRequirement()

  const onSetVoiceRequirementSubmit = (
    data: VoiceParticipationForm,
    method: "POST" | "PATCH"
  ) =>
    (method === "POST" ? onSubmit : onEditSubmit)({
      poapId: poapData?.id,
      voiceChannelId: data?.voiceChannelId,
      voiceRequirement:
        data?.voiceRequirement?.type === "MINUTE"
          ? { minute: data?.voiceRequirement?.percentOrMinute }
          : { percent: data?.voiceRequirement?.percentOrMinute },
    })

  const { onSubmit: onDeleteSubmit, isLoading: isDeleteLoading } =
    useDeleteVoiceRequirement()

  return (
    <FormProvider {...methods}>
      <SimpleGrid gap={4} columns={{ base: 1, md: 2 }}>
        <FormControl isRequired isInvalid={!!errors?.voiceChannelId}>
          <FormLabel>Voice channel:</FormLabel>

          {voiceChannels?.length <= 0 ? (
            <Button isDisabled isLoading loadingText="Loading channels" w="full" />
          ) : (
            <Select
              {...register("voiceChannelId", {
                required: "This field is required ",
              })}
              defaultValue={poapEventDetails?.voiceChannelId}
            >
              {voiceChannels?.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </Select>
          )}

          <FormErrorMessage>{errors?.voiceChannelId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isRequired
          isInvalid={!!(errors?.voiceRequirement as any)?.percentOrMinute}
        >
          <FormLabel>Minimum participation:</FormLabel>

          <HStack spacing={0}>
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
                  w="full"
                  ref={ref}
                  value={value ?? undefined}
                  onChange={(newValue) => {
                    const parsedValue = parseInt(newValue)
                    onChange(isNaN(parsedValue) ? "" : parsedValue)
                  }}
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
              maxW={32}
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
            {(errors?.voiceRequirement as any)?.percentOrMinute?.message}
          </FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <ButtonGroup mt={8} justifyContent="right" w="full">
        {poapEventDetails?.voiceChannelId && (
          <Button
            variant="ghost"
            color="gray.400"
            leftIcon={<Icon as={TrashSimple} />}
            onClick={() => onDeleteSubmit({ poapId: poapData?.id })}
            isLoading={isDeleteLoading}
          >
            Remove
          </Button>
        )}
        <Button
          colorScheme="yellow"
          onClick={handleSubmit((data) =>
            onSetVoiceRequirementSubmit(
              data,
              !poapEventDetails?.voiceChannelId ? "POST" : "PATCH"
            )
          )}
          isLoading={isLoading || isEditLoading}
          disabled={!isDirty}
        >
          Save
        </Button>
      </ButtonGroup>

      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default VoiceParticipation
