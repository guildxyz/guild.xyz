import { FormControl, FormLabel } from "@chakra-ui/react"
import { SingleChoice } from "components/[guild]/CreateFormModal/components/Display/Choice"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState } from "react-hook-form"

const ExpectedSingleChoice = ({ field }) => {
  const { errors } = useFormState()
  const { field: controllerField } = useController({
    name: "value",
    rules: { required: "This field is required" },
  })

  return (
    <FormControl isInvalid={!!errors?.value}>
      <FormLabel>Option to select</FormLabel>

      <SingleChoice field={field} {...controllerField} />

      <FormErrorMessage>{errors?.value?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default ExpectedSingleChoice
