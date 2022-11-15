import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "types"
import parseFromObject from "utils/parseFromObject"

const GithubStar = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()

  const { field } = useController({
    name: `${baseFieldPath}.data.id`,
    rules: {
      required: "Specifying a repository is required",
      pattern: {
        value: /^https:\/\/github.com\/.+$/i,
        message: "Has to be a valid GitHub repo link",
      },
    },
  })

  return (
    <FormControl
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id?.message}
    >
      <FormLabel>Repository link</FormLabel>
      <Input
        {...field}
        onChange={({ target: { value } }) => {
          const isLink = value.includes("github.com")
          if (!isLink) {
            return field.onChange(value)
          }

          return field.onChange(
            !value.startsWith("www") && !value.startsWith("github.com")
              ? value.replace("www.", "")
              : `https://${value}`.replace("www.", "")
          )
        }}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default GithubStar
