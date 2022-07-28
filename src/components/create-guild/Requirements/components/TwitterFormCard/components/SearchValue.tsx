import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { useFormContext, useFormState } from "react-hook-form"

const SearchValue = ({ index }: { index: number }) => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  return (
    <>
      <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.id?.message}>
        <FormLabel>Text</FormLabel>
        <Input
          {...register(`requirements.${index}.data.id`, {
            required: "This field if required",
          })}
        />
        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default SearchValue
