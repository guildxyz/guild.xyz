import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import { useFormContext, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
type Props = {
  baseFieldPath: string
  isMinAmountRequired?: boolean
  isMaxAmountRequired?: boolean
}
const GithubAccountAge = ({
  baseFieldPath,
  isMinAmountRequired,
  isMaxAmountRequired,
}: Props) => {
  const { errors } = useFormState()
  const { getValues } = useFormContext()

  return (
    <>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
        isRequired={
          isMinAmountRequired && !getValues(`${baseFieldPath}.data.maxAmount`)
        }
      >
        <FormLabel>From</FormLabel>
        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.minAmount`}
          isRequired={
            isMinAmountRequired ?? !getValues(`${baseFieldPath}.data.maxAmount`)
          }
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
        isRequired={
          isMaxAmountRequired ?? !getValues(`${baseFieldPath}.data.minAmount`)
        }
      >
        <FormLabel>To</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.maxAmount`}
          isRequired={
            isMaxAmountRequired ?? !getValues(`${baseFieldPath}.data.minAmount`)
          }
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.maxAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default GithubAccountAge
