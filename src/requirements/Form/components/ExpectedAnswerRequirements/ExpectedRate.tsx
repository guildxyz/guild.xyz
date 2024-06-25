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

const ExpectedRate = ({ field }) => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  const minValue = field.options[0]
  const maxValue = field.options.at(-1)

  const inputRules = {
    required: "This field is required",
    min: { value: minValue, message: `Minimum value is ${minValue}` },
    max: { value: maxValue, message: `Maximum value is ${maxValue}` },
    shouldUnregister: true,
  }

  return (
    <HStack alignItems={"flex-start"}>
      <FormControl isInvalid={!!errors?.minAmount}>
        <FormLabel>Min rating</FormLabel>
        <NumberInput min={minValue} max={maxValue}>
          <NumberInputField
            placeholder={minValue}
            {...register("minAmount", inputRules)}
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors?.minAmount?.message as string}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors?.maxAmount}>
        <FormLabel>Max rating</FormLabel>
        <NumberInput min={minValue} max={maxValue}>
          <NumberInputField
            placeholder={maxValue}
            {...register("maxAmount", inputRules)}
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

export default ExpectedRate
