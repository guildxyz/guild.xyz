import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import { useFormContext, useFormState } from "react-hook-form"

export const ExpectedRate = ({ field }) => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  const minValue = field.options[0]
  const maxValue = field.options.at(-1)

  return (
    <HStack alignItems={"flex-start"}>
      <FormControl isInvalid={!!errors?.minAmount}>
        <FormLabel mb="0">Min rating</FormLabel>
        <NumberInput min={minValue} max={maxValue}>
          <NumberInputField
            placeholder={minValue}
            {...register("minAmount", { required: "This field is required" })}
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors?.minAmount?.message as string}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors?.maxAmount}>
        <FormLabel mb="0">Max rating</FormLabel>
        <NumberInput min={minValue} max={maxValue}>
          <NumberInputField
            placeholder={maxValue}
            {...register("maxAmount", { required: "This field is required" })}
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors?.maxAmount?.message as string}</FormErrorMessage>
      </FormControl>
    </HStack>
  )
}
