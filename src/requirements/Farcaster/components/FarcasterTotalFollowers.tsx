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
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const FarcasterTotalFollowers = ({ baseFieldPath }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.min}
    >
      <FormLabel>Number of followers?</FormLabel>

      <Controller
        name={`${baseFieldPath}.data.min` as const}
        control={control}
        rules={{
          required: "This field is required.",
          min: {
            value: 1,
            message: "Amount must be positive",
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
            max={20}
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
        {parseFromObject(errors, baseFieldPath)?.data?.min?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default FarcasterTotalFollowers
