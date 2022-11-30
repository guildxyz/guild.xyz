import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const VaultField = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.vault}
    >
      <FormLabel>Vault</FormLabel>

      <Input
        {...register(`${baseFieldPath}.data.vault`, {
          required: "This field is required",
          pattern: {
            value: ADDRESS_REGEX,
            message:
              "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
          },
        })}
        placeholder="Vault address"
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.vault?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default VaultField
