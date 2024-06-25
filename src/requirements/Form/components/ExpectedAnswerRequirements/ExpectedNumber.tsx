import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import { useFormContext, useFormState } from "react-hook-form"

const ExpectedNumber = () => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  return (
    <FormControl isInvalid={!!errors?.value}>
      <FormLabel>Answer should be equal to</FormLabel>

      <NumberInput>
        <NumberInputField
          placeholder="0"
          {...register("value", {
            required: "This field is required",
            shouldUnregister: true,
          })}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <FormErrorMessage>{errors?.value?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default ExpectedNumber
