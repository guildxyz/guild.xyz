import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  format?: "INT" | "FLOAT"
  baseFieldPath: string
  label: string
  fieldName: string
  max?: number
  helperText?: string
} & FormControlProps

const NumberField = ({
  format = "INT",
  baseFieldPath,
  label,
  fieldName,
  max,
  helperText,
  ...rest
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const handleChange = (newValue, onChange) => {
    if (/^[0-9]*\.0*$/i.test(newValue)) return onChange(newValue)
    const parsedValue = format === "INT" ? parseInt(newValue) : parseFloat(newValue)
    return onChange(isNaN(parsedValue) ? "" : parsedValue)
  }

  return (
    <FormControl
      {...rest}
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.[fieldName]}
    >
      <FormLabel>{label}</FormLabel>

      <Controller
        name={`${baseFieldPath}.data.${fieldName}` as const}
        control={control}
        rules={{
          required: rest.isRequired ? "This field is required." : undefined,
          min: {
            value: 0,
            message: "Amount must be positive",
          },
          max: max
            ? {
                value: max,
                message: `Must be less than ${max}`,
              }
            : undefined,
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <NumberInput
            ref={ref}
            value={value ?? ""}
            onChange={(newValue) => handleChange(newValue, onChange)}
            onBlur={onBlur}
            min={0}
            max={max}
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
        {parseFromObject(errors, baseFieldPath)?.data?.[fieldName]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default NumberField
