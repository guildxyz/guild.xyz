import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const Stamp = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const minAmount = useWatch({ name: `${baseFieldPath}.data.minAmount` })
  const maxAmount = useWatch({ name: `${baseFieldPath}.data.maxAmount` })

  return (
    <>
      <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.stamp}>
        <FormLabel>Stamp</FormLabel>

        <Input {...register(`${baseFieldPath}.data.stamp`)} />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.stamp?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.issuer}
      >
        <FormLabel>Issuer</FormLabel>

        <Input {...register(`${baseFieldPath}.data.issuer`)} />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.issuer?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.credType}
      >
        <FormLabel>Credential type</FormLabel>

        <Input {...register(`${baseFieldPath}.data.credType`)} />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.credType?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>Issued after</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.minAmount`}
          max={maxAmount}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
      >
        <FormLabel>Issued before</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.maxAmount`}
          min={minAmount}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.maxAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default Stamp
