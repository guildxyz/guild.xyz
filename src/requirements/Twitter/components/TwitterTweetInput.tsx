import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const TwitterTweetInput = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()

  const { field } = useController({
    name: `${baseFieldPath}.data.id`,
    rules: {
      required: "This field is required",
    },
  })

  return (
    <FormControl
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id?.message}
    >
      <FormLabel>Tweet ID</FormLabel>

      <Input
        {...field}
        onChange={({ target: { value } }) => {
          if (value.length <= 0) return field.onChange(value)

          const linkMatch = value.split("/")

          return field.onChange(linkMatch[linkMatch.length - 1])
        }}
      />
      <FormHelperText>Paste tweet URL</FormHelperText>
      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TwitterTweetInput
