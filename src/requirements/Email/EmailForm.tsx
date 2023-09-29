import { Divider, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const guildRequirementTypes = [
  {
    label: "Verify an email",
    value: "EMAIL_VERIFIED",
  },
  {
    label: "Verify an email with domain",
    value: "EMAIL_DOMAIN",
  },
] as const

const EmailForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const type = useWatch({ name: `${baseFieldPath}.type` })

  const { errors, touchedFields } = useFormState()
  const { resetField, register } = useFormContext()

  const selected = guildRequirementTypes.find((reqType) => reqType.value === type)

  useEffect(() => {
    if (!touchedFields?.data) return
    resetField(`${baseFieldPath}.data.domain`)
  }, [type])

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={guildRequirementTypes}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.value === "EMAIL_DOMAIN" && (
        <>
          <Divider />
          <FormControl
            isInvalid={
              !!parseFromObject(errors, baseFieldPath)?.data?.domain?.message
            }
          >
            <FormLabel>Domain</FormLabel>

            <Input
              {...register(`${baseFieldPath}.data.domain`, {
                required: selected?.value === "EMAIL_DOMAIN",
              })}
            />

            <FormErrorMessage>
              {parseFromObject(errors, baseFieldPath)?.data?.domain?.message}
            </FormErrorMessage>
          </FormControl>
        </>
      )}
    </Stack>
  )
}

export default EmailForm
