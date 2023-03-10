import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import RelativeTimeInput from "components/common/RelativeTimeInput"
import { useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const CaptchaForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()

  return (
    <FormControl>
      <FormLabel>Maximum completed captcha age</FormLabel>

      <RelativeTimeInput
        fieldName={`${baseFieldPath}.data.maxAmount`}
        checkForTouched="data"
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath).data?.maxAmount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default CaptchaForm
