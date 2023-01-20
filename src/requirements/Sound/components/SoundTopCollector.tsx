import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import SoundArtistSelect from "./SoundArtistSelect"

const SoundTopCollector = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <SoundArtistSelect baseFieldPath={baseFieldPath} />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.topAmount}
      >
        <FormLabel>Top:</FormLabel>
        <Controller
          name={`${baseFieldPath}.data.topAmount` as const}
          control={control}
          rules={{
            required: "This field is required.",
            min: {
              value: 1,
              message: "Amount must be positive",
            },
            max: {
              value: 51,
              message: "Amount must be less than or equal to 51",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumberInput
              ref={ref}
              value={value ?? ""}
              onChange={(newValue) => {
                const parsedValue = parseInt(newValue)
                onChange(isNaN(parsedValue) ? "" : parsedValue)
              }}
              onBlur={onBlur}
              min={1}
              max={51}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.topAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default SoundTopCollector
