import { FormControl, FormLabel, HStack } from "@chakra-ui/react"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormState } from "react-hook-form"
import { SelectOption } from "types"

const QuestionSelector = ({
  formId,
  disabledQuestions,
}: {
  formId: number
  disabledQuestions: string[]
}) => {
  const { errors } = useFormState()
  const { form, isLoading, isValidating } = useGuildForm(formId)

  if (!formId) return null

  const questionOptions: SelectOption<string>[] =
    form.fields?.map((field) => ({
      label: field.question,
      value: field.id,
      isDisabled: disabledQuestions.includes(field.id),
    })) ?? []

  return (
    <FormControl isInvalid={!!errors?.fieldId}>
      <HStack justifyContent="space-between" mb="2">
        <FormLabel mb="0">Select question</FormLabel>
      </HStack>
      <ControlledSelect
        name={`fieldId`}
        isDisabled={!form}
        isLoading={isLoading || isValidating}
        options={questionOptions}
      />

      <FormErrorMessage>{errors?.fieldId?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default QuestionSelector
