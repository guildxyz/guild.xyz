import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { useFormContext, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const TwitterTextToInclude = ({ baseFieldPath }: RequirementFormProps) => {
  const { register } = useFormContext()
  const { errors } = useFormState()

  return (
    <>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      >
        <FormLabel>Text to include</FormLabel>
        <Input
          {...register(`${baseFieldPath}.data.id`, {
            required: "This field if required",
            validate: (value) => {
              if (value.startsWith(" ")) return "Should not start with a space"
              if (value.endsWith(" ")) return "Should not end with a space"
              return true
            },
          })}
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default TwitterTextToInclude
