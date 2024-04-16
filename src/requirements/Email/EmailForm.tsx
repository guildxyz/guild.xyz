import { Divider, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import AllowlistFormInputs from "requirements/Allowlist/components/AllowlistFormInputs"
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
  {
    label: "Be included in email allowlist",
    value: "ALLOWLIST_EMAIL",
  },
] as const

const EmailForm = ({ baseFieldPath, field }: RequirementFormProps): JSX.Element => {
  const type = useWatch({ name: `${baseFieldPath}.type` })

  const {
    resetField,
    register,
    formState: { errors },
  } = useFormContext()

  const selected = guildRequirementTypes.find((reqType) => reqType.value === type)

  const isEditMode = !!field?.id

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
          afterOnChange={() => resetField(`${baseFieldPath}.data.domain`)}
          isDisabled={isEditMode}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.value === "ALLOWLIST_EMAIL" && (
        <AllowlistFormInputs baseFieldPath={baseFieldPath} />
      )}

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
