import {
  Box,
  FormControl,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import { VoiceParticipationForm } from "types"

const VoiceMinuteSettings = (): JSX.Element => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<VoiceParticipationForm>()

  return (
    <Box px={5} pb={4}>
      <FormControl w={56} isInvalid={!!errors?.voiceRequirement?.minute}>
        <InputGroup>
          <Controller
            name="voiceRequirement.minute"
            control={control}
            rules={{
              required:
                getValues("voiceRequirementType") === "MINUTE"
                  ? "This field is required."
                  : false,
              min: {
                value: 0,
                message: "Must be positive",
              },
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

          <InputRightAddon>minutes</InputRightAddon>
        </InputGroup>

        <FormErrorMessage>
          {errors?.voiceRequirement?.minute?.message}
        </FormErrorMessage>
      </FormControl>
    </Box>
  )
}

export default VoiceMinuteSettings
