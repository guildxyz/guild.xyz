import { FormControl, FormLabel, HStack } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildForms from "components/[guild]/hooks/useGuildForms"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { PlatformType, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import AddFormButton from "./AddFormButton"

const FormForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { id, guildPlatforms } = useGuild()
  const formRewardIds =
    guildPlatforms
      ?.filter((gp) => gp.platformId === PlatformType.FORM)
      .map((gp) => gp.platformGuildData.formId) ?? []
  const { data: forms, isLoading, isValidating } = useGuildForms()

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
      <HStack justifyContent="space-between" mb="2">
        <FormLabel mb="0">Fill form:</FormLabel>
        <AddFormButton baseFieldPath={baseFieldPath} />
      </HStack>
      <ControlledSelect
        name={`${baseFieldPath}.data.id`}
        isDisabled={!forms}
        isLoading={isLoading || isValidating}
        options={formOptions}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}
export default FormForm
