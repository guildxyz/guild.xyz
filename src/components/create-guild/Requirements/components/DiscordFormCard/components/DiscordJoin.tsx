import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const DiscordJoin = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()

  const { field } = useController({
    name: `${baseFieldPath}.data.memberSince`,
    shouldUnregister: true,
  })

  return (
    <Stack w="full">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.memberSince}
      >
        <FormLabel>Registered before</FormLabel>

        <Input
          type="date"
          ref={field.ref}
          name={field.name}
          value={
            field.value && !isNaN(field.value)
              ? new Date(field.value).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => {
            const valueAsTimestamp = new Date(e.target.value).getTime()
            field.onChange(valueAsTimestamp)
          }}
          onBlur={field.onBlur}
          max={new Date().toISOString().split("T")[0]}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.memberSince?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default DiscordJoin
