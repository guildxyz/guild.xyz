import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const DiscordJoin = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()

  const { field: memberSinceField } = useController({
    name: `${baseFieldPath}.data.memberSince`,
  })

  return (
    <Stack w="full">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.memberSince}
      >
        <FormLabel>Registration date</FormLabel>

        <Input
          type="date"
          ref={memberSinceField.ref}
          name={memberSinceField.name}
          value={
            typeof memberSinceField.value === "number"
              ? new Date(memberSinceField.value).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => {
            const valueAsTimestamp = new Date(e.target.value).getTime()
            memberSinceField.onChange(valueAsTimestamp)
          }}
          onBlur={memberSinceField.onBlur}
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
