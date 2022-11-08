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
}

const MinAmountInput = ({
  baseFieldPath,
  label,
  helperText,
}: Props): JSX.Element => {
  const { errors } = useFormState()
  const { control } = useFormContext()

  return (
    <FormControl
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
    >
      <FormLabel>{label}</FormLabel>

      <Controller
        name={`${baseFieldPath}.data.minAmount` as const}
        control={control}
        rules={{
          min: {
            value: 0,
            message: "Amount must be positive",
          },
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <NumberInput
            ref={ref}
            value={value ?? ""}
            onChange={(newValue) => {
              const parsedValue = parseInt(newValue)
              onChange(isNaN(parsedValue) ? "" : parsedValue)
            }}
            onBlur={onBlur}
            min={1}
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
