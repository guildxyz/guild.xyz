import {
  FormControl,
  FormHelperText,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
  label: string
  helperText?: string
  min?: number
  defaultValue?: number
}

const MinAmountInput = ({
  baseFieldPath,
  label,
  helperText,
  min = 0,
  defaultValue,
}: Props): JSX.Element => {
  const { errors } = useFormState()
  const { control } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
    >
      <FormLabel>{label}</FormLabel>

      <Controller
        name={`${baseFieldPath}.data.minAmount` as const}
        control={control}
        rules={{
          required: "This field is required.",
          min: {
            value: min,
            message:
              min - 1 >= 0
                ? `Amount must be greater than ${min - 1}`
                : "Amount must be positive",
          },
        }}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <NumberInput
            ref={ref}
            value={value ?? ""}
            onChange={(newValue) => {
              const parsedValue = parseInt(newValue)
              onChange(isNaN(parsedValue) ? "" : parsedValue)
            }}
            onBlur={onBlur}
            min={min}
            defaultValue={defaultValue}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        )}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.minAmount?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default MinAmountInput
