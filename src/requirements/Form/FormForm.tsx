import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import FormSelector from "./components/FormSelector"

const formRequirementTypes = [
  {
    label: "Fill form",
    value: "FORM_SUBMISSION",
    FormRequirement: FormSelector,
  },
  {
    label: "Answer question specifically",
    value: "FORM_SUBMISSION_DETAILED",
    FormRequirement: FormSelector,
  },
]

const FormForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const { id } = useGuild()
  const { errors } = useFormState()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const selected = formRequirementTypes.find((reqType) => reqType.value === type)
  const isEditMode = !!field?.id

  useController({
    name: `${baseFieldPath}.data.guildId`,
    defaultValue: id,
  })

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={formRequirementTypes}
          isDisabled={isEditMode}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.FormRequirement && (
        <>
          <Divider />
          <selected.FormRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}
export default FormForm
