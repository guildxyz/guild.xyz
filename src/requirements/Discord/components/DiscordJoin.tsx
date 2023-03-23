import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import { useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const DiscordJoin = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()

  return (
    <Stack w="full">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.memberSince}
      >
        <FormLabel>Registered before</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.memberSince`}
          isRequired
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.memberSince?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default DiscordJoin
