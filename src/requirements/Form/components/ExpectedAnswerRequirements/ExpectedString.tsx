import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { Controller, useFormContext, useFormState } from "react-hook-form"

export const ExpectedString = () => {
  const { control } = useFormContext()
  const { errors } = useFormState()

  return (
    <FormControl isInvalid={!!errors?.value}>
      <FormLabel mb="0">Answer should be equal to</FormLabel>

      <Controller
        control={control}
        name="value"
        rules={{ required: "This field is required" }}
        render={({ field }) => <Input {...field} />}
      />

      <FormErrorMessage>{errors?.value?.message as string}</FormErrorMessage>
    </FormControl>
  )
}
