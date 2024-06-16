import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { useFormContext, useFormState } from "react-hook-form"

export const ExactString = () => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  return (
    <FormControl isInvalid={!!errors?.value}>
      <FormLabel mb="0">Answer should be equal to</FormLabel>

      <Input {...register("value")} />

      <FormErrorMessage>{errors?.value?.message as string}</FormErrorMessage>
    </FormControl>
  )
}
