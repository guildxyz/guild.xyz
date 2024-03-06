import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  chakra,
} from "@chakra-ui/react"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const TwitterListInput = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()

  const { field } = useController({
    name: `${baseFieldPath}.data.id`,
    rules: {
      required: "This field is required",
    },
  })

  return (
    <>
      <Alert status="info">
        <AlertIcon />
        <AlertDescription>
          X <chakra.span opacity={0.5}>(formerly Twitter)</chakra.span>{" "}
          authentication limits to about 450 requests every 15 minutes. Users may
          need to wait if this threshold is exceeded.
        </AlertDescription>
      </Alert>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      >
        <FormLabel>List ID</FormLabel>

        <Input
          {...field}
          onChange={({ target: { value } }) => {
            if (value.length <= 0) return field.onChange(value)

            const splittedLink = value.split("?")[0].split("/")

            return field.onChange(splittedLink[splittedLink.length - 1])
          }}
        />
        <FormHelperText>Paste list URL</FormHelperText>
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default TwitterListInput
