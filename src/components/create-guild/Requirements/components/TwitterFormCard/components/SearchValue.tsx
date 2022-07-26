import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { useFormContext, useFormState } from "react-hook-form"

const SearchValue = ({ index }: { index: number }) => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  return (
    <>
      <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.value?.message}>
        <FormLabel>Search value</FormLabel>
        <Input
          {...register(`requirements.${index}.data.value`, {
            required: "Please enter a search value",
          })}
        />
        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.value?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default SearchValue
