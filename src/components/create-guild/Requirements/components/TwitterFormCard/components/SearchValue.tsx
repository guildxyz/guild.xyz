import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { useFormContext, useFormState } from "react-hook-form"
import { FormCardProps } from "types"
import parseFromObject from "utils/parseFromObject"

const SearchValue = ({ baseFieldPath }: FormCardProps) => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  return (
    <>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      >
        <FormLabel>Text</FormLabel>
        <Input
          {...register(`${baseFieldPath}data.id`, {
            required: "This field if required",
          })}
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default SearchValue
