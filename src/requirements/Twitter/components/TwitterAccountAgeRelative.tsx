import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledRelativeTimeInput } from "components/common/RelativeTimeInput"
import { useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

const TwitterAccountAgeRelative = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
    >
      <FormLabel>Minimum account age</FormLabel>

      <ControlledRelativeTimeInput
        fieldName={`${baseFieldPath}.data.minAmount`}
        isRequired
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TwitterAccountAgeRelative
