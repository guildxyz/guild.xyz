import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import ControlledNumberInput from "./ControlledNumberInput"

type Props = {
  baseFieldPath: string
  formLabel: string
}

const TxCountFormField = ({ baseFieldPath, formLabel }: Props): JSX.Element => {
  const { errors } = useFormState()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.txCount}
    >
      <FormLabel>{formLabel}</FormLabel>

      <ControlledNumberInput name={`${baseFieldPath}.data.txCount`} isRequired />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.txCount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TxCountFormField
