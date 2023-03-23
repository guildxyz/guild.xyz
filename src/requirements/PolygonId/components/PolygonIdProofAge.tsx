import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import ControlledRelativeTimeInput from "components/common/RelativeTimeInput"
import { useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const PolygonIdProofAge = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()

  return (
    <FormControl>
      <FormLabel>Maximum proof age</FormLabel>

      <ControlledRelativeTimeInput fieldName={`${baseFieldPath}.data.maxAmount`} />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath).data?.maxAmount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default PolygonIdProofAge
