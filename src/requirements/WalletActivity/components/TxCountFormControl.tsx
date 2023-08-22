import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import ControlledNumberInput from "./ControlledNumberInput"

type Props = {
  baseFieldPath: string
  formLabel: string
  numberFormat?: "INT" | "FLOAT"
}

const TxCountFormControl = ({
  baseFieldPath,
  formLabel,
  numberFormat = "INT",
}: Props): JSX.Element => {
  const { errors } = useFormState()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.txCount}
    >
      <FormLabel>{formLabel}</FormLabel>

      <ControlledNumberInput
        numberFormat={numberFormat}
        name={`${baseFieldPath}.data.txCount`}
        isRequired
        min={1}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.txCount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TxCountFormControl
