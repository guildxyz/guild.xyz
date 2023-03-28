import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import ControlledNumberInput from "./ControlledNumberInput"

type Props = {
  baseFieldPath: string
}

const TxValueFormControl = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.txValue}
    >
      <FormLabel>Asset amount</FormLabel>

      <ControlledNumberInput
        numberFormat="FLOAT"
        name={`${baseFieldPath}.data.txValue`}
        isRequired
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.txValue?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TxValueFormControl
