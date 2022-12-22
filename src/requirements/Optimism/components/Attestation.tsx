import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const Attestation = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.creator}
      >
        <FormLabel>Creator</FormLabel>

        <Input
          {...register(`${baseFieldPath}.data.creator`, {
            required: "This field is required.",
            pattern: {
              value: ADDRESS_REGEX,
              message:
                "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
            },
          })}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.creator?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.key}
      >
        <FormLabel>Key</FormLabel>

        <Input
          {...register(`${baseFieldPath}.data.key`, {
            required: "This field is required.",
          })}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.key?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.val}>
        <FormLabel>Value</FormLabel>

        <Input {...register(`${baseFieldPath}.data.val`)} />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.val?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default Attestation
