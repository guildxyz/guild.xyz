import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  chakra,
} from "@chakra-ui/react"
import { useFormContext, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const TwitterTextToInclude = ({ baseFieldPath }: RequirementFormProps) => {
  const { register } = useFormContext()
  const { errors } = useFormState()

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
