import {
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const Rep3Form = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  useController({
    name: `${baseFieldPath}.chain`,
    defaultValue: "POLYGON",
  })

  const {
    field: { ref, name, value, onChange, onBlur },
  } = useController({
    name: `${baseFieldPath}.data.id`,
    rules: {
      required: "This field is required.",
    },
  })

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Badge contract address</FormLabel>

        <Input
          {...register(`${baseFieldPath}.address`, {
            required: "This field is required.",
            pattern: {
              value: ADDRESS_REGEX,
              message:
                "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
            },
          })}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Level:</FormLabel>

        <NumberInput
          ref={ref}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          min={0}
          max={256}
        >
          <NumberInputField placeholder="0-256" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default Rep3Form
