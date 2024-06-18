import { Stack } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useEffect } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import FormSelector from "./components/FormSelector"
import SetExpectedAnswers from "./components/SetExpectedAnswers"

const FormForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { setValue } = useFormContext()
  const { id } = useGuild()

  const selectedFormId = useWatch({ name: `${baseFieldPath}.data.id` })
  const answers = useWatch({ name: `${baseFieldPath}.data.answers` })

  useController({
    name: `${baseFieldPath}.data.guildId`,
    defaultValue: id,
  })

  useEffect(() => {
    if (answers?.length) setValue("type", "FORM_SUBMISSION_DETAILED")
    else setValue("type", "FORM_SUBMISSION")
  }, [answers?.length])

  return (
    <Stack spacing={5} alignItems="start">
      <FormSelector baseFieldPath={baseFieldPath} isDisabled={answers?.length} />
      <SetExpectedAnswers
        formId={selectedFormId}
        isDisabled={!selectedFormId}
        baseFieldPath={baseFieldPath}
      />
    </Stack>
  )
}
export default FormForm
