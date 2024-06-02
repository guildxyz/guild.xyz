import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildForms from "components/[guild]/hooks/useGuildForms"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { PlatformType, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

const FormForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { id, guildPlatforms } = useGuild()
  const formRewardIds =
    guildPlatforms
      ?.filter((gp) => gp.platformId === PlatformType.FORM)
      .map((gp) => gp.platformGuildData.formId) ?? []
  const { data: forms, isLoading } = useGuildForms()
  const { errors } = useFormState()

  useController({
    name: `${baseFieldPath}.data.guildId`,
    defaultValue: id,
  })

  const formOptions: SelectOption<number>[] =
    forms
      ?.filter((form) => formRewardIds.includes(form.id))
      .map((form) => ({
        label: form.name,
        value: form.id,
      })) ?? []

  return (
    <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}>
      <FormLabel>Fill form:</FormLabel>
      <ControlledSelect
        name={`${baseFieldPath}.data.id`}
        isDisabled={!forms}
        isLoading={isLoading}
        options={formOptions}
      />
      <FormHelperText>
        You can create new forms in the add reward menu
      </FormHelperText>
      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}
export default FormForm
