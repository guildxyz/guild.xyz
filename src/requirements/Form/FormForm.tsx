import { Stack } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useController, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import FormSelector from "./components/FormSelector"
import SetExpectedAnswers from "./components/SetExpectedAnswers"

const FormForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { id } = useGuild()

  const selectedFormId = useWatch({ name: `${baseFieldPath}.data.id` })
  const answers = useWatch({ name: `${baseFieldPath}.data.answers` })

  useController({
    name: `${baseFieldPath}.data.guildId`,
    defaultValue: id,
  })

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
