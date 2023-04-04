import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import { useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const GithubAccountAge = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>From</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.minAmount`}
          isRequired
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
      >
        <FormLabel>To</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.maxAmount`}
          isRequired
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.maxAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default GithubAccountAge
