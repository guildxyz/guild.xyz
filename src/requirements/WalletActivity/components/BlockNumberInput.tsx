import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import ControlledNumberInput from "./ControlledNumberInput"

type Props = { formLabel: string; formHelperText?: string } & RequirementFormProps

const BlockNumberInput = ({
  baseFieldPath,
  formLabel,
  formHelperText,
}: Props): JSX.Element => {
  const { errors } = useFormState()

  return (
    <FormControl
      w="full"
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
    >
      <FormLabel>{formLabel}</FormLabel>

      <ControlledNumberInput name={`${baseFieldPath}.data.maxAmount`} isRequired />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.maxAmount?.message}
      </FormErrorMessage>

      {formHelperText && <FormHelperText>{formHelperText}</FormHelperText>}
    </FormControl>
  )
}

export default BlockNumberInput
