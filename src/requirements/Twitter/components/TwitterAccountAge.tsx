import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import { useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const TwitterAccountAge = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>Registered before</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.minAmount`}
          isRequired
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default TwitterAccountAge
