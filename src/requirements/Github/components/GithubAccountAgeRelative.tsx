import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { ControlledRelativeTimeInput } from "components/common/RelativeTimeInput"
import { useFormContext, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
type Props = {
  baseFieldPath: string
  isMinAmountRequired?: boolean
  isMaxAmountRequired?: boolean
}
const GithubAccountAgeRelative = ({
  baseFieldPath,
  isMinAmountRequired,
  isMaxAmountRequired,
}: Props) => {
  const { errors } = useFormState()
  const { getValues } = useFormContext()

  return (
    <>
      <FormControl
        isRequired={
          isMinAmountRequired && !getValues(`${baseFieldPath}.data.maxAmount`)
        }
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>From</FormLabel>

        <ControlledRelativeTimeInput
          fieldName={`${baseFieldPath}.data.minAmount`}
          isRequired={
            isMinAmountRequired && !getValues(`${baseFieldPath}.data.maxAmount`)
          }
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        isRequired={
          isMaxAmountRequired && !getValues(`${baseFieldPath}.data.minAmount`)
        }
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
      >
        <FormLabel>To</FormLabel>

        <ControlledRelativeTimeInput
          fieldName={`${baseFieldPath}.data.maxAmount`}
          isRequired={
            isMaxAmountRequired && !getValues(`${baseFieldPath}.data.minAmount`)
          }
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.maxAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default GithubAccountAgeRelative
